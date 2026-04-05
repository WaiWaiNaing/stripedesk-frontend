export interface CheckoutReconcilePaidPayload {
  state: "paid";
  order_id: number;
  invoice_id: number | null;
  receipt_id?: number | null;
  invoice?: Record<string, unknown>;
}

export interface CheckoutReconcilePendingPayload {
  state: "pending";
  order_id: number;
  payment_status: string;
  session_status: string;
}

export type CheckoutReconcilePayload = CheckoutReconcilePaidPayload | CheckoutReconcilePendingPayload;
