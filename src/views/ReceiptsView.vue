<script setup lang="ts">
import { computed, ref } from "vue";

const receiptId = ref("10042");

const receiptPayload = computed(() =>
  JSON.stringify(
    {
      id: receiptId.value,
      payment_intent: "pi_3Q1demo",
      amount: 3120,
      currency: "usd",
      status: "succeeded",
      customer: "Sable Studio",
      issued_at: "2026-04-01T09:14:00Z",
    },
    null,
    2,
  ),
);
</script>

<template>
  <section class="space-y-8">
    <div>
      <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Receipts</p>
      <h1 class="mt-2 text-3xl font-semibold text-white">Receipt lookup</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        The original frontend had a dedicated receipt fetch flow by ID. This keeps that interaction
        pattern and gives you a Tailwind shell ready for the API call.
      </p>
    </div>

    <div class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <article class="rounded-[28px] border border-white/10 bg-slate-900/80 p-6">
        <h2 class="text-lg font-medium text-white">Search receipt</h2>
        <p class="mt-2 text-sm leading-6 text-slate-400">
          Enter a receipt ID from invoice detail or an admin action.
        </p>

        <label class="mt-6 block text-sm text-slate-300">
          Receipt ID
          <input
            v-model="receiptId"
            type="text"
            class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60"
            placeholder="10042"
          />
        </label>

        <button
          type="button"
          class="mt-4 w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          Load receipt
        </button>
      </article>

      <article class="rounded-[28px] border border-white/10 bg-slate-900/80 p-6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-medium text-white">Payload preview</h2>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            JSON
          </span>
        </div>

        <pre
          class="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-300"
        ><code>{{ receiptPayload }}</code></pre>
      </article>
    </div>
  </section>
</template>
