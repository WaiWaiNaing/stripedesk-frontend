/** Mirrors OpenAPI `CartLine` */
export interface CartLine {
  product_id: number;
  product_name: string;
  product_description: string | null;
  quantity: number;
  price: string;
  line_total: string;
  currency_id: number | null;
}

/** Cart row is loosely typed in the spec (`additionalProperties: true`). */
export interface CartRecord {
  id: number;
  status?: string;
  user_id?: number;
  expires_at?: string | null;
  [key: string]: unknown;
}

export interface CartDetail {
  cart: CartRecord;
  lines: CartLine[];
}

export interface CartDetailResponse {
  success: boolean;
  data: CartDetail;
}

export interface CartAddItemRequest {
  product_id: number;
  quantity?: number | null;
}

export interface CheckoutSessionRequest {
  product_id?: number;
  cart_id?: number | null;
  quantity?: number | null;
}

export interface CheckoutSessionData {
  order_id?: number;
  checkout_session_id?: string;
  checkout_url?: string;
  [key: string]: unknown;
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: CheckoutSessionData;
}
