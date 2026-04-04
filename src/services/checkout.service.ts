import { api } from "@/app/api/api";
import type { ApiSuccessResponse } from "@/type/auth.type";
import type { CheckoutReconcilePayload } from "@/type/checkout.type";

export async function reconcileCheckoutSession(sessionId: string): Promise<CheckoutReconcilePayload> {
  const { data } = await api.post<ApiSuccessResponse<CheckoutReconcilePayload>>("/checkout/reconcile", {
    session_id: sessionId,
  });
  return data.data;
}
