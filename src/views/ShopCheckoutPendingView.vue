<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { reconcileCheckoutSession } from "@/services/checkout.service";
import { getApiErrorMessage } from "@/services/auth.service";
import { toast } from "@/lib/toast";

const route = useRoute();
const auth = useAuthStore();

const busy = ref(false);
const lastError = ref<string | null>(null);

const sessionId = computed(() => {
  const id = route.query.session_id;
  return typeof id === "string" && id.length > 0 ? id : "";
});

async function retry() {
  if (!sessionId.value || !auth.isAuthenticated) {
    return;
  }
  busy.value = true;
  lastError.value = null;
  try {
    const data = await reconcileCheckoutSession(sessionId.value);
    if (data.state === "paid") {
      window.location.replace(`/shop/success?session_id=${encodeURIComponent(sessionId.value)}`);
      return;
    }
    toast.info("Stripe still shows this session as unpaid or open. We’ll keep trying from our side too.");
  } catch (e) {
    lastError.value = getApiErrorMessage(e, "Could not reach the server.");
    toast.error(lastError.value);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="space-y-8">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Checkout</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Payment pending</h1>
      <p class="mt-2 max-w-xl text-sm text-slate-400">
        Stripe has not marked this session as paid yet, or our server is still processing the webhook. You
        can safely retry, or wait—our system reconciles pending checkouts about every 15 minutes.
      </p>
    </div>

    <div
      class="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8 text-center shadow-[0_0_0_1px_rgba(251,191,36,0.08)_inset]"
    >
      <p class="text-sm text-amber-100/90">
        No charge will be duplicated: we only finalize your order once Stripe reports a successful payment.
      </p>

      <div v-if="!auth.isAuthenticated" class="mt-6">
        <router-link
          :to="{ name: 'login', query: { redirect: route.fullPath } }"
          class="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
        >
          Sign in to refresh status
        </router-link>
      </div>

      <div v-else class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          :disabled="busy || !sessionId"
          class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          @click="retry"
        >
          {{ busy ? "Checking…" : "Check again" }}
        </button>
        <router-link
          to="/invoices"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:border-white/25 hover:bg-white/10"
        >
          My invoices
        </router-link>
        <router-link
          to="/shop"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:border-white/25 hover:bg-white/10"
        >
          Continue shopping
        </router-link>
      </div>

      <p v-if="lastError" class="mt-4 text-xs text-red-300/90">{{ lastError }}</p>
    </div>
  </section>
</template>
