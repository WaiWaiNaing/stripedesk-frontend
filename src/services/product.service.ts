import type { AxiosRequestConfig } from "axios";
import { api } from "@/app/api/api";
import type { ProductListResponse } from "@/type/product.type";

export const productService = {
  async listProducts() {
    const { data } = await api.get<ProductListResponse>("/products");
    return data;
  },

  /** Same catalog as `listProducts`, but 401 does not trigger refresh / login redirect (for public pages). */
  async listProductsAllowAnonymous(): Promise<ProductListResponse> {
    const config: AxiosRequestConfig & { __allowAnonymous401?: boolean } = {
      __allowAnonymous401: true,
    };
    const { data } = await api.get<ProductListResponse>("/products", config);
    return data;
  },
};
