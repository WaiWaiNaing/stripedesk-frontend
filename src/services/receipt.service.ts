import { AppConfig } from "@/app/config/AppConfig";
import { api } from "@/app/api/api";
import type { ReceiptListResponse } from "@/type/receipt.type";

function normalizedApiBase(): string {
  const raw = AppConfig.apiBaseUrl;
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.replace(/\/$/, "");
  }
  return "/api/v1";
}

export const receiptService = {
  async listForUser(userId: number) {
    const { data } = await api.get<ReceiptListResponse>(`/users/${userId}/receipts`);
    return data;
  },
};

/** URL for authenticated PDF download (same-site cookies apply on navigation). */
export function receiptPdfUrl(receiptId: number): string {
  return `${normalizedApiBase()}/receipts/${receiptId}/pdf`;
}
