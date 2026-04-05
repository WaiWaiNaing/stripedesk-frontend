export interface ReceiptInvoiceSummary {
  id: number;
  order_id: number;
  invoice_number: string;
  total_amount: string;
  status: string;
  due_date?: string | null;
  created_at?: string | null;
}

export interface ReceiptSummaryRecord {
  id: number;
  invoice_id: number;
  receipt_number: string;
  amount_paid: string;
  paid_at?: string | null;
  created_at?: string | null;
  invoice: ReceiptInvoiceSummary;
}

export interface ReceiptListResponse {
  success: boolean;
  data: ReceiptSummaryRecord[];
}
