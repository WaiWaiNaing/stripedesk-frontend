export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  currency_code: string;
  stripe_price_id: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface AdminCurrency {
  id: number;
  code: string;
  numeric_code: string | null;
  name: string;
  minor_unit: number;
  symbol: string | null;
  is_default: boolean;
  created_at: string;
}

export interface ApiListEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiIdEnvelope {
  success: boolean;
  data: { id: number };
}

export interface AdminStripeLog {
  id: number;
  event_type: string;
  created_at: string;
  payload: Record<string, unknown>;
}
