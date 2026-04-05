<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import CartLineItem from "@/components/cart/CartLineItem.vue";
import CartPaymentSummary from "@/components/cart/CartPaymentSummary.vue";
import { toast } from "@/lib/toast";
import {
  useAddCartItemMutation,
  useCartQuery,
  useCheckoutInvoiceMutation,
  useRemoveCartLineMutation,
  useUpdateCartLineMutation,
} from "@/query/cart.query";
import { useAuthStore } from "@/stores/auth";
import type { CartLine } from "@/type/cart.type";

const MAX_QTY = 25;

const auth = useAuthStore();
const router = useRouter();

const userId = computed(() => auth.user?.id);

const cartQuery = useCartQuery(userId);
const checkoutInvoiceMutation = useCheckoutInvoiceMutation();
const addItemMutation = useAddCartItemMutation();
const updateLineMutation = useUpdateCartLineMutation();
const removeLineMutation = useRemoveCartLineMutation();

const detail = computed(() => cartQuery.data.value?.data ?? null);
const lines = computed<CartLine[]>(() => detail.value?.lines ?? []);

const subtotal = computed(() => {
  let sum = 0;
  for (const line of lines.value) {
    sum += Number.parseFloat(line.line_total) || 0;
  }
  return sum.toFixed(2);
});

const cartId = computed(() => detail.value?.cart?.id);
const checkoutPending = computed(() => checkoutInvoiceMutation.isPending.value);
const canCheckout = computed(
  () => cartId.value != null && lines.value.length > 0 && !checkoutPending.value,
);

const busyProductId = ref<number | null>(null);

const showCartChrome = computed(() => !cartQuery.isLoading.value && !cartQuery.isError.value);

watch(
  () => cartQuery.isError.value,
  (failed) => {
    if (failed) toast.error("Could not load your cart.");
  },
);

function setBusy(id: number | null) {
  busyProductId.value = id;
}

async function onIncrement(line: CartLine) {
  const uid = userId.value;
  const cid = cartId.value;
  if (uid == null || cid == null) return;

  if (line.quantity >= MAX_QTY) {
    toast.error(`Maximum ${MAX_QTY} per product.`);
    return;
  }

  setBusy(line.product_id);
  try {
    await addItemMutation.mutateAsync({
      userId: uid,
      body: { product_id: line.product_id, quantity: 1 },
    });
  } catch {
    toast.error("Could not update quantity.");
  } finally {
    setBusy(null);
  }
}

async function onDecrement(line: CartLine) {
  const uid = userId.value;
  const cid = cartId.value;
  if (uid == null || cid == null) return;

  setBusy(line.product_id);
  try {
    if (line.quantity <= 1) {
      await removeLineMutation.mutateAsync({
        productId: line.product_id,
        userId: uid,
      });
    } else {
      await updateLineMutation.mutateAsync({
        cartId: cid,
        productId: line.product_id,
        userId: uid,
        body: { quantity: line.quantity - 1 },
      });
    }
  } catch {
    toast.error("Could not update quantity.");
  } finally {
    setBusy(null);
  }
}

async function onRemove(line: CartLine) {
  const uid = userId.value;
  const cid = cartId.value;
  if (uid == null || cid == null) return;

  setBusy(line.product_id);
  try {
    await removeLineMutation.mutateAsync({
      productId: line.product_id,
      userId: uid,
    });
  } catch {
    toast.error("Could not remove item.");
  } finally {
    setBusy(null);
  }
}

async function startCheckout() {
  const id = cartId.value;
  if (id == null) return;

  try {
    const invoiceRes = await checkoutInvoiceMutation.mutateAsync({ cart_id: id });
    const invoiceId = resolveInvoiceId(invoiceRes);
    if (!invoiceId) {
      toast.error("Invoice id was not returned. Please try again.");
      return;
    }
    await router.push({ name: "invoice-detail", params: { id: String(invoiceId) } });
  } catch {
    toast.error("Could not start checkout. Please try again.");
  }
}

function resolveInvoiceId(payload: { data?: Record<string, unknown> } | null | undefined): number | null {
  const data = payload?.data ?? {};
  const candidates: unknown[] = [
    data.id,
    data.invoice_id,
    (data.invoice as Record<string, unknown> | undefined)?.id,
  ];

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return null;
}

function goShop() {
  void router.push({ name: "shop" });
}
</script>

<template>
  <div class="mx-auto pb-[calc(9rem+env(safe-area-inset-bottom,0px))]">
    <div class="mb-8">
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Checkout</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Your cart</h1>
    </div>

    <div
      v-if="cartQuery.isLoading.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300"
    >
      Loading cart…
    </div>

    <div
      v-else-if="cartQuery.isError.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      <p>Your cart could not be loaded.</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
          @click="() => cartQuery.refetch()"
        >
          Retry
        </button>
        <button
          type="button"
          class="text-sm font-medium text-indigo-300 underline underline-offset-4 hover:text-indigo-200"
          @click="goShop"
        >
          Back to shop
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Items card: scrollable list only (totals live in fixed bar) -->
      <div class="relative">
        <div
          class="pointer-events-none absolute inset-x-3 -top-2 bottom-4 rounded-[1.75rem] border border-white/5 bg-linear-to-b from-indigo-500/10 to-transparent"
          aria-hidden="true"
        />
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-sm"
        >
          <div
            class="flex flex-col gap-2 border-b border-white/10 bg-white/3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Cart</p>
              <p class="mt-1 text-lg font-semibold text-white">
                {{
                  lines.length === 0
                    ? "No items yet"
                    : `${lines.length} line${lines.length === 1 ? "" : "s"}`
                }}
              </p>
            </div>
            <div v-if="detail?.cart?.expires_at" class="text-xs text-slate-500">
              Expires {{ String(detail.cart.expires_at) }}
            </div>
          </div>

          <div class="max-h-[min(55vh,28rem)] overflow-y-auto sm:max-h-[min(60vh,32rem)]">
            <template v-if="lines.length === 0">
              <div class="px-6 py-14 text-center text-sm text-slate-400">
                <p>Your cart is empty.</p>
                <button
                  type="button"
                  class="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
                  @click="goShop"
                >
                  Browse products
                </button>
              </div>
            </template>
            <CartLineItem
              v-for="line in lines"
              v-else
              :key="line.product_id"
              :line="line"
              :busy="busyProductId === line.product_id"
              @increment="onIncrement(line)"
              @decrement="onDecrement(line)"
              @remove="onRemove(line)"
            />
          </div>
        </div>
      </div>
    </template>

    <CartPaymentSummary
      v-if="showCartChrome"
      :subtotal="subtotal"
      :can-checkout="canCheckout"
      :checkout-pending="checkoutPending"
      @checkout="startCheckout"
    />
  </div>
</template>
