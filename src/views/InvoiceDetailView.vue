<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "@/lib/toast";
import AppButton from "@/components/ui/AppButton.vue";
import { useInvoiceDetailQuery, useInvoicePayMutation } from "@/query/invoice.query";

const route = useRoute();
const router = useRouter();

const invoiceId = computed(() => {
  const raw = route.params.id;
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(n) ? n : null;
});

const invoiceQuery = useInvoiceDetailQuery(invoiceId);
const payMutation = useInvoicePayMutation();

const payload = computed<Record<string, unknown> | null>(() => invoiceQuery.data.value?.data ?? null);
const invoice = computed<Record<string, unknown>>(() => {
  const p = payload.value ?? {};
  const nested = p.invoice as Record<string, unknown> | undefined;
  return nested ?? p;
});
const order = computed<Record<string, unknown>>(() => {
  const p = payload.value ?? {};
  return (p.order as Record<string, unknown> | undefined) ?? {};
});
const firstLine = computed<Record<string, unknown>>(() => {
  const p = payload.value ?? {};
  const lines = p.lines;
  if (Array.isArray(lines) && lines.length > 0 && typeof lines[0] === "object" && lines[0] !== null) {
    return lines[0] as Record<string, unknown>;
  }
  return {};
});

function asText(value: unknown, fallback = "—") {
  if (value == null) return fallback;
  const s = String(value).trim();
  return s.length > 0 ? s : fallback;
}

const invoiceLabel = computed(
  () =>
    asText(invoice.value.invoice_number, "") ||
    (invoiceId.value != null ? `Invoice #${invoiceId.value}` : "Invoice detail"),
);
const statusText = computed(() => asText(invoice.value.status, asText(order.value.status, "unknown")));
const issuedAtText = computed(() => asText(invoice.value.issued_at, asText(invoice.value.created_at)));
const productText = computed(() => asText(firstLine.value.product_name, asText(invoice.value.product_name)));

const isPaid = computed(() => statusText.value.toLowerCase() === "paid");
const canPay = computed(() => !!invoiceId.value && !payMutation.isPending.value && !isPaid.value);

const amountText = computed(() => {
  const total = invoice.value.total ?? order.value.total_amount ?? invoice.value.subtotal ?? null;
  const ccy = invoice.value.currency ?? "";
  if (!total) return "—";
  return `${total}${ccy ? ` ${ccy}` : ""}`;
});

function extractCheckoutUrl(payload: { data?: Record<string, unknown> } | null | undefined): string | null {
  const data = payload?.data ?? {};
  const payment = data.payment as Record<string, unknown> | undefined;
  const candidates: unknown[] = [
    data.checkout_url,
    data.stripe_checkout_url,
    payment?.checkout_url,
    payment?.stripe_checkout_url,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) return value;
  }

  return null;
}

async function payInvoice() {
  if (!invoiceId.value) return;
  try {
    const res = await payMutation.mutateAsync({ invoiceId: invoiceId.value });
    const url = extractCheckoutUrl(res);
    if (url) {
      window.location.href = url;
      return;
    }
    toast.info("Payment request sent, but no checkout URL returned yet.");
  } catch {
    toast.error("Could not start payment for this invoice.");
  }
}

function backToInvoices() {
  void router.push({ name: "invoices" });
}
</script>

<template>
  <section class="space-y-6">
    <div
      class="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(125deg,rgba(99,102,241,0.20),rgba(15,23,42,0.86),rgba(14,165,233,0.16))] px-6 py-5 shadow-[0_26px_80px_-36px_rgba(59,130,246,0.45)] sm:px-7 sm:py-6"
    >
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.32em] text-indigo-200/75">Invoice detail</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {{ invoiceLabel }}
          </h1>
        </div>
        <button
          type="button"
          class="rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/12"
          @click="backToInvoices"
        >
          Back to invoices
        </button>
      </div>
    </div>

    <div v-if="invoiceQuery.isLoading.value" class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
      Loading invoice…
    </div>

    <div
      v-else-if="invoiceQuery.isError.value || !payload"
      class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
    >
      Could not load invoice detail.
    </div>

    <template v-else>
      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <h2 class="text-lg font-semibold text-white">Overview</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
              <p class="mt-1 text-sm font-medium text-slate-200">{{ statusText }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Amount</p>
              <p class="mt-1 text-sm font-medium text-slate-200">{{ amountText }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Issued at</p>
              <p class="mt-1 text-sm font-medium text-slate-200">{{ issuedAtText }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Product</p>
              <p class="mt-1 text-sm font-medium text-slate-200">{{ productText }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Action</p>
          <p class="mt-2 text-sm text-slate-300">Complete payment securely for this invoice.</p>
          <div class="mt-5">
            <AppButton :disabled="!canPay" :loading="payMutation.isPending.value" @click="payInvoice">
              {{ isPaid ? "Already paid" : "Pay invoice" }}
            </AppButton>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

