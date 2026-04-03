<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useInvoicesQuery } from "@/query/invoice.query";
import type { InvoiceSummaryRecord } from "@/type/invoice.type";

const router = useRouter();
const invoicesQuery = useInvoicesQuery();
const invoices = computed<InvoiceSummaryRecord[]>(() => invoicesQuery.data.value?.data ?? []);

function statusClass(statusRaw: unknown) {
  const status = String(statusRaw ?? "").toLowerCase();
  if (status === "paid") return "bg-emerald-400/10 text-emerald-300";
  if (status === "pending" || status === "unpaid") return "bg-amber-400/10 text-amber-300";
  return "bg-rose-400/10 text-rose-300";
}

function amountText(invoice: InvoiceSummaryRecord) {
  const total = invoice.total ?? "—";
  const ccy = invoice.currency ?? "";
  return `${total}${ccy ? ` ${ccy}` : ""}`;
}

function viewDetail(invoice: InvoiceSummaryRecord) {
  void router.push({ name: "invoice-detail", params: { id: String(invoice.id) } });
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Invoices</p>
        <h1 class="mt-2 text-3xl font-semibold text-white">Billing records</h1>
      </div>
    </div>

    <div
      v-if="invoicesQuery.isLoading.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      Loading invoices…
    </div>

    <div
      v-else-if="invoicesQuery.isError.value"
      class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
    >
      Failed to load invoices.
    </div>

    <div v-else class="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
      <div class="border-b border-white/10 px-6 py-4">
        <h2 class="text-lg font-medium text-white">Recent invoices</h2>
      </div>

      <div class="divide-y divide-white/10">
        <div v-if="invoices.length === 0" class="px-6 py-8 text-sm text-slate-400">
          No invoices found.
        </div>
        <article
          v-for="invoice in invoices"
          :key="invoice.id"
          class="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="text-base font-medium text-white">{{ invoice.invoice_number ?? `#${invoice.id}` }}</p>
            <p class="mt-1 text-sm text-slate-400">Invoice ID {{ invoice.id }}</p>
          </div>

          <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p class="text-sm text-slate-300">{{ amountText(invoice) }}</p>
            <span
              class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium"
              :class="statusClass(invoice.status)"
            >
              {{ invoice.status ?? "unknown" }}
            </span>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ invoice.issued_at ?? "—" }}</p>
            <button
              type="button"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              @click="viewDetail(invoice)"
            >
              View detail
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
