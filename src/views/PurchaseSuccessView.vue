<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

/** Shortened Stripe Checkout session id for display (support / receipts). */
const sessionLabel = computed(() => {
  const id = route.query.session_id;
  if (typeof id !== "string" || id.length === 0) {
    return null;
  }
  if (id.length <= 28) {
    return id;
  }
  return `${id.slice(0, 18)}…${id.slice(-10)}`;
});
</script>

<template>
  <section class="space-y-8">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Checkout</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Thank you</h1>
      <p class="mt-2 max-w-xl text-sm text-slate-400">
        Your payment was successful. Stripe has confirmed this session—you can keep shopping or review
        your invoices anytime.
      </p>
    </div>

    <div
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
        <p class="mt-6 text-xs uppercase tracking-[0.28em] text-slate-500">Order confirmed</p>
        <h2 class="mt-2 text-xl font-semibold text-white sm:text-2xl">You&rsquo;re all set</h2>
        <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          We’ve recorded your purchase. If you signed in, your invoices list will update shortly; otherwise
          check your email for the receipt from Stripe.
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
          to="/shop"
          class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Continue shopping
        </router-link>
        <router-link
          to="/invoices"
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
        >
          View invoices
        </router-link>
      </div>
    </div>
  </section>
</template>
