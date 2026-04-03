export interface InvoiceSummaryRecord {
  id: number;
  invoice_number?: string;
  total?: string;
  currency?: string;
  status?: string;
  issued_at?: string;
  [key: string]: unknown;
}

export interface InvoiceDetailRecord {
  id: number;
  invoice_number?: string;
  subtotal?: string;
  tax?: string;
  total?: string;
  currency?: string;
  status?: string;
  issued_at?: string;
  user_name?: string;
  user_email?: string;
  product_name?: string;
  [key: string]: unknown;
}

export interface InvoiceListResponse {
  success: boolean;
  data: InvoiceSummaryRecord[];
}

export interface InvoiceDetailResponse {
  success: boolean;
  data: InvoiceDetailRecord;
}

export interface InvoicePayResponse {
  success: boolean;
  data: Record<string, unknown>;
}

