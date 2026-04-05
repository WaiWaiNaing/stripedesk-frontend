import { useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { receiptService } from "@/services/receipt.service";
import type { ReceiptListResponse } from "@/type/receipt.type";

export const receiptQueryKeys = {
  all: ["receipts"] as const,
  user: (userId: number) => [...receiptQueryKeys.all, userId] as const,
};

export function useReceiptsQuery(userId: MaybeRefOrGetter<number | null | undefined>) {
  const uid = computed(() => toValue(userId) ?? null);

  return useQuery<ReceiptListResponse>({
    queryKey: computed(() =>
      uid.value != null && uid.value > 0
        ? receiptQueryKeys.user(uid.value)
        : ([...receiptQueryKeys.all, "disabled"] as const),
    ),
    queryFn: () => receiptService.listForUser(uid.value!),
    enabled: computed(() => uid.value != null && uid.value > 0),
    retry: false,
  });
}
