<script setup lang="ts">
interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  updatedAt: string;
}

const invoices: Invoice[] = [
  { id: "INV-2408", customer: "Northstar Labs", amount: "$12,400", status: "Paid", updatedAt: "Today" },
  { id: "INV-2407", customer: "Sable Studio", amount: "$3,120", status: "Pending", updatedAt: "Yesterday" },
  { id: "INV-2406", customer: "Aster & Co.", amount: "$9,900", status: "Overdue", updatedAt: "2 days ago" },
];

function statusClass(status: Invoice["status"]) {
  if (status === "Paid") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (status === "Pending") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-rose-400/10 text-rose-300";
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Invoices</p>
        <h1 class="mt-2 text-3xl font-semibold text-white">Billing records</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          The source app used cards plus a drawer for invoice detail. This version keeps that screen
          structure and presents invoice records in a clean responsive list.
        </p>
      </div>
    </div>

    <div class="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
      <div class="border-b border-white/10 px-6 py-4">
        <h2 class="text-lg font-medium text-white">Recent invoices</h2>
      </div>

      <div class="divide-y divide-white/10">
        <article
          v-for="invoice in invoices"
          :key="invoice.id"
          class="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="text-base font-medium text-white">{{ invoice.id }}</p>
            <p class="mt-1 text-sm text-slate-400">{{ invoice.customer }}</p>
          </div>

          <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p class="text-sm text-slate-300">{{ invoice.amount }}</p>
            <span
              class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium"
              :class="statusClass(invoice.status)"
            >
              {{ invoice.status }}
            </span>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ invoice.updatedAt }}</p>
            <button
              type="button"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              View detail
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
