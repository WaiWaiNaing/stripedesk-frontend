import { useMutation, useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { invoiceService } from "@/services/invoice.service";
import type { InvoiceDetailResponse, InvoiceListResponse, InvoicePayResponse } from "@/type/invoice.type";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  detail: (id: number) => [...invoiceQueryKeys.all, id] as const,
};

export function useInvoicesQuery() {
  return useQuery<InvoiceListResponse>({
    queryKey: invoiceQueryKeys.all,
    queryFn: () => invoiceService.listInvoices(),
  });
}

export function useInvoiceDetailQuery(invoiceId: MaybeRefOrGetter<number | null | undefined>) {
  const id = computed(() => toValue(invoiceId) ?? null);

  return useQuery<InvoiceDetailResponse>({
    queryKey: computed(() => (id.value ? invoiceQueryKeys.detail(id.value) : [...invoiceQueryKeys.all, "disabled"])),
    queryFn: () => invoiceService.getInvoiceDetail(id.value!),
    enabled: computed(() => !!id.value && id.value > 0),
  });
}

export function useInvoicePayMutation() {
  return useMutation<InvoicePayResponse, unknown, { invoiceId: number }>({
    mutationFn: ({ invoiceId }) => invoiceService.payInvoice(invoiceId),
  });
}

