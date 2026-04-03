import type { ApiSuccessResponse } from "./auth.type";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  currency_code: string;
  stripe_price_id: string | null;
}

export type ProductListResponse = ApiSuccessResponse<Product[]>;
