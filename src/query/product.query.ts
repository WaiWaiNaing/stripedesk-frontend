import { useQuery } from "@tanstack/vue-query";
import { productService } from "@/services/product.service";
import type { ProductListResponse } from "@/type/product.type";

export const useProductQuery = () => {
  return useQuery<ProductListResponse>({
    queryKey: ["products"],
    queryFn: () => productService.listProducts(),
  });
};

/** For public routes: anonymous 401 returns error without global auth redirect. */
export const usePublicProductPreviewQuery = () => {
  return useQuery({
    queryKey: ["products", "public-preview"],
    queryFn: async (): Promise<ProductListResponse> =>
      productService.listProductsAllowAnonymous(),
    retry: false,
  });
};

/** Shop catalog for guests and signed-in users (avoids global 401 handling for anonymous visitors). */
export const useShopProductQuery = () => {
  return useQuery({
    queryKey: ["products", "shop"],
    queryFn: async (): Promise<ProductListResponse> =>
      productService.listProductsAllowAnonymous(),
    retry: false,
  });
};
