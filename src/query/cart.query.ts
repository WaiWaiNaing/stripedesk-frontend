import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { cartService } from "@/services/cart.service";
import type {
  CartAddItemRequest,
  CartDetailResponse,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
} from "@/type/cart.type";

export const cartQueryKeys = {
  all: ["cart"] as const,
  user: (userId: number) => [...cartQueryKeys.all, userId] as const,
};

export function useCartQuery(userId: MaybeRefOrGetter<number | null | undefined>) {
  const uid = computed(() => toValue(userId) ?? null);

  return useQuery<CartDetailResponse | null>({
    queryKey: computed(() =>
      uid.value != null && uid.value > 0
        ? cartQueryKeys.user(uid.value)
        : ([...cartQueryKeys.all, "disabled"] as const),
    ),
    queryFn: () => cartService.getActiveCartForUser(uid.value!),
    enabled: computed(() => uid.value != null && uid.value > 0),
    retry: false,
  });
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      body,
    }: {
      userId: number;
      body: CartAddItemRequest;
    }) => {
      return cartService.addItemToUserCart(userId, body);
    },
    onSuccess: (_data, { userId }) => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKeys.user(userId) });
    },
  });
}

export function useCheckoutSessionMutation() {
  return useMutation<CheckoutSessionResponse, unknown, CheckoutSessionRequest>({
    mutationFn: (body) => cartService.createCheckoutSession(body),
  });
}
