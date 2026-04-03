import { useQuery } from "@tanstack/vue-query";
import { productService } from "@/services/product.service";
import type { ProductListResponse } from "@/type/product.type";

export const useProductQuery = () => {
  return useQuery<ProductListResponse>({
    queryKey: ["products"],
    queryFn: () => productService.listProducts(),
  });
};
