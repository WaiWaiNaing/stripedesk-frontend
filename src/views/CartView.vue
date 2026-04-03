<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";
import { useCartQuery, useCheckoutSessionMutation } from "@/query/cart.query";
import { useAuthStore } from "@/stores/auth";
import type { CartLine } from "@/type/cart.type";

const auth = useAuthStore();
const router = useRouter();

const userId = computed(() => auth.user?.id);

const cartQuery = useCartQuery(userId);
const checkoutMutation = useCheckoutSessionMutation();

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
const checkoutPending = computed(() => checkoutMutation.isPending.value);
const canCheckout = computed(
  () => cartId.value != null && lines.value.length > 0 && !checkoutPending.value,
);

const checkoutError = ref<string | null>(null);

async function startCheckout() {
  checkoutError.value = null;
  const id = cartId.value;
  if (id == null) return;

  try {
    const res = await checkoutMutation.mutateAsync({ cart_id: id });
    const url = res.data?.checkout_url;
    if (typeof url === "string" && url.length > 0) {
      window.location.href = url;
      return;
    }
    checkoutError.value = "Checkout did not return a payment URL. Try again later.";
  } catch {
    checkoutError.value = "Could not start checkout. Please try again.";
  }
}

function goShop() {
  void router.push({ name: "shop" });
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Checkout</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Your cart</h1>
      <p class="mt-2 max-w-xl text-sm text-slate-400">
        Review items below, then continue to secure payment. Quantities are merged when you add the
        same product again from the shop.
      </p>
    </div>

    <div v-if="cartQuery.isLoading.value" class="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
      Loading cart…
    </div>

    <div
      v-else-if="cartQuery.isError.value"
      class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
    >
      Could not load your cart. Try again or return to the shop.
      <button
        type="button"
        class="mt-4 text-sm font-medium text-white underline underline-offset-4"
        @click="goShop"
      >
        Back to shop
      </button>
    </div>

    <template v-else>
      <!-- Layered panel: back plate + front card -->
      <div class="relative">
        <div
          class="pointer-events-none absolute inset-x-4 -top-3 bottom-8 rounded-[1.75rem] border border-white/5 bg-linear-to-b from-indigo-500/10 to-transparent"
          aria-hidden="true"
        />
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-sm"
        >
          <!-- Layer: summary strip -->
          <div
            class="flex flex-col gap-2 border-b border-white/10 bg-white/3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Cart</p>
              <p class="mt-1 text-lg font-semibold text-white">
                {{ lines.length === 0 ? "No items yet" : `${lines.length} line${lines.length === 1 ? "" : "s"}` }}
              </p>
            </div>
            <div v-if="detail?.cart?.expires_at" class="text-xs text-slate-500">
              Expires {{ String(detail.cart.expires_at) }}
            </div>
          </div>

          <!-- Layer: line items -->
          <div class="divide-y divide-white/10">
            <div
              v-if="lines.length === 0"
              class="px-6 py-14 text-center text-sm text-slate-400"
            >
              <p>Your cart is empty.</p>
              <button
                type="button"
                class="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
                @click="goShop"
              >
                Browse products
              </button>
            </div>

            <div
              v-for="line in lines"
              :key="`${line.product_id}-${line.product_name}`"
              class="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0">
                <p class="font-medium text-white">{{ line.product_name }}</p>
                <p v-if="line.product_description" class="mt-1 line-clamp-2 text-sm text-slate-400">
                  {{ line.product_description }}
                </p>
                <p class="mt-2 text-xs text-slate-500">{{ line.quantity }} × {{ line.price }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-sm font-semibold text-white">{{ line.line_total }}</p>
              </div>
            </div>
          </div>

          <!-- Layer: totals + checkout -->
          <div class="border-t border-white/10 bg-linear-to-t from-slate-950/80 to-transparent px-6 py-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Subtotal</p>
                <p class="mt-1 text-2xl font-semibold text-white">{{ subtotal }}</p>
              </div>
              <div class="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
                <AppButton
                  class="w-full justify-center sm:w-auto"
                  :disabled="!canCheckout"
                  :loading="checkoutPending"
                  @click="startCheckout"
                >
                  Continue to payment
                </AppButton>
                <p v-if="checkoutError" class="text-center text-xs text-red-400 sm:text-right">
                  {{ checkoutError }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
