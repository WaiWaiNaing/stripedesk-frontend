import { AppConfig } from "@/app/config/AppConfig";
import { api } from "@/app/api/api";
import type { ReceiptListResponse } from "@/type/receipt.type";

export const receiptService = {
  async listForUser(userId: number) {
    const { data } = await api.get<ReceiptListResponse>(`/users/${userId}/receipts`);
    return data;
  },
};

/** Absolute or root-relative URL for authenticated PDF download (cookies sent on same-site navigation). */
export function receiptPdfUrl(receiptId: number): string {
  const base = (AppConfig.apiBaseUrl ?? "/api/v1").replace(/\/$/, "");
  return `${base}/receipts/${receiptId}/pdf`;
}
