import { api } from "@/app/api/api";
import type { InvoiceDetailResponse, InvoiceListResponse, InvoicePayResponse } from "@/type/invoice.type";

export const invoiceService = {
  async listInvoices() {
    const { data } = await api.get<InvoiceListResponse>("/invoices");
    return data;
  },

  async getInvoiceDetail(id: number) {
    const { data } = await api.get<InvoiceDetailResponse>(`/invoices/${id}`);
    return data;
  },

  async payInvoice(id: number) {
    const { data } = await api.post<InvoicePayResponse>(`/invoices/${id}/pay`);
    return data;
  },
};

