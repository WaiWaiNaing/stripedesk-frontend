<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { reconcileCheckoutSession } from "@/services/checkout.service";
import { getApiErrorMessage } from "@/services/auth.service";
import { toast } from "@/lib/toast";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const loading = ref(true);
const errorKey = ref<"none" | "missing_session" | "sign_in" | "reconcile">("none");
const paid = ref(false);
const invoiceId = ref<number | null>(null);
const orderId = ref<number | null>(null);

const sessionId = computed(() => {
  const id = route.query.session_id;
  return typeof id === "string" && id.length > 0 ? id : "";
});

const sessionLabel = computed(() => {
  const id = sessionId.value;
  if (!id) return null;
  if (id.length <= 28) return id;
  return `${id.slice(0, 18)}…${id.slice(-10)}`;
});

onMounted(async () => {
  if (!sessionId.value) {
    errorKey.value = "missing_session";
    loading.value = false;
    return;
  }

  if (!auth.isAuthenticated) {
    errorKey.value = "sign_in";
    loading.value = false;
    return;
  }

  try {
    const data = await reconcileCheckoutSession(sessionId.value);
    if (data.state === "pending") {
      await router.replace({
        name: "shop-checkout-pending",
        query: { session_id: sessionId.value },
      });
      return;
    }
    paid.value = true;
    orderId.value = data.order_id;
    invoiceId.value = data.invoice_id ?? null;
  } catch (e) {
    errorKey.value = "reconcile";
    toast.error(getApiErrorMessage(e, "Could not confirm your payment. Try again or check back shortly."));
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="space-y-8">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Checkout</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Return from Stripe</h1>
      <p class="mt-2 max-w-xl text-sm text-slate-400">
        We confirm your order here if the webhook is still catching up, then send you to your receipt.
      </p>
    </div>

    <div
      v-if="loading"
      class="rounded-3xl border border-white/10 bg-white/4 p-8 text-center text-slate-400"
    >
      Confirming payment…
    </div>

    <div
      v-else-if="errorKey === 'missing_session'"
      class="rounded-3xl border border-white/10 bg-white/4 p-8 text-center text-slate-300"
    >
      <p>This page needs a Stripe <code class="text-slate-400">session_id</code> in the URL.</p>
      <router-link
        to="/shop"
        class="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:border-white/25 hover:bg-white/10"
      >
        Back to shop
      </router-link>
    </div>

    <div
      v-else-if="errorKey === 'sign_in'"
      class="rounded-3xl border border-white/10 bg-white/4 p-8 text-center text-slate-300"
    >
      <p>Sign in to link this checkout to your account and see your invoice.</p>
      <router-link
        :to="{ name: 'login', query: { redirect: route.fullPath } }"
        class="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
      >
        Sign in
      </router-link>
    </div>

    <div
      v-else-if="errorKey === 'reconcile'"
      class="rounded-3xl border border-white/10 bg-white/4 p-8 text-center text-slate-300"
    >
      <p>We couldn’t verify this session yet.</p>
      <button
        type="button"
        class="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:border-white/25 hover:bg-white/10"
        @click="() => router.push({ name: 'shop-checkout-pending', query: { session_id: sessionId } })"
      >
        View pending status
      </button>
    </div>

    <div
      v-else-if="paid"
      class="rounded-3xl border border-white/10 bg-white/4 p-8 sm:p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
    >
      <div class="flex flex-col items-center text-center">
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
          aria-hidden="true"
        >
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="mt-6 text-xs uppercase tracking-[0.28em] text-slate-500">Paid</p>
        <h2 class="mt-2 text-xl font-semibold text-white sm:text-2xl">Thank you</h2>
        <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Your order is recorded.
          <span v-if="orderId"> Order #{{ orderId }}.</span>
          You can open the invoice for full line items and receipts.
        </p>
        <p
          v-if="sessionLabel"
          class="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 font-mono text-xs text-slate-500"
        >
          Session: {{ sessionLabel }}
        </p>
      </div>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <router-link
          v-if="invoiceId"
          :to="{ name: 'invoice-detail', params: { id: String(invoiceId) } }"
          class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          View invoice
        </router-link>
        <router-link
          to="/invoices"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
        >
          All invoices
        </router-link>
        <router-link
          to="/shop"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
        >
          Continue shopping
        </router-link>
      </div>
    </div>
  </section>
</template>
