import { api } from "@/app/api/api";
import type { ProductListResponse } from "@/type/product.type";

export const productService = {
  async listProducts() {
    const { data } = await api.get<ProductListResponse>("/products");
    return data;
  },
};
