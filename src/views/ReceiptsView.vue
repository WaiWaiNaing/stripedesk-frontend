<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useReceiptsQuery } from "@/query/receipt.query";
import { receiptPdfUrl } from "@/services/receipt.service";
import { useAuthStore } from "@/stores/auth";
import type { ReceiptSummaryRecord } from "@/type/receipt.type";

const auth = useAuthStore();
const router = useRouter();

const userId = computed(() => auth.user?.id ?? null);
const receiptsQuery = useReceiptsQuery(userId);
const receipts = computed<ReceiptSummaryRecord[]>(() => receiptsQuery.data.value?.data ?? []);

function viewInvoice(invoiceId: number) {
  void router.push({ name: "invoice-detail", params: { id: String(invoiceId) } });
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Receipts</p>
        <h1 class="mt-2 text-3xl font-semibold text-white">Payment receipts</h1>
        <p class="mt-2 max-w-xl text-sm text-slate-400">
          After checkout completes, your receipts appear here. Download each as a PDF for your records.
        </p>
      </div>
    </div>

    <div
      v-if="!userId"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      Sign in to see your receipts.
    </div>

    <div
      v-else-if="receiptsQuery.isLoading.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      Loading receipts…
    </div>

    <div
      v-else-if="receiptsQuery.isError.value"
      class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
    >
      Failed to load receipts.
    </div>

    <div v-else class="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
      <div class="border-b border-white/10 px-6 py-4">
        <h2 class="text-lg font-medium text-white">Your receipts</h2>
      </div>

      <div class="divide-y divide-white/10">
        <div v-if="receipts.length === 0" class="px-6 py-8 text-sm text-slate-400">
          No receipts yet. Complete a purchase to generate one.
        </div>
        <article
          v-for="row in receipts"
          :key="row.id"
          class="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p class="text-base font-medium text-white">{{ row.receipt_number }}</p>
            <p class="mt-1 text-sm text-slate-400">
              Invoice {{ row.invoice?.invoice_number ?? `#${row.invoice_id}` }} · Paid
              {{ row.amount_paid }}
            </p>
            <p v-if="row.paid_at" class="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
              {{ row.paid_at }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <a
              :href="receiptPdfUrl(row.id)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-300/50 hover:bg-indigo-500/25"
            >
              Download PDF
            </a>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
              @click="viewInvoice(row.invoice_id)"
            >
              View invoice
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
