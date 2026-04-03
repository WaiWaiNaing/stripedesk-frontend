<script setup lang="ts">
import { Minus, Plus, Trash2 } from "@lucide/vue";
import type { CartLine } from "@/type/cart.type";

interface Props {
  line: CartLine;
  busy: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  increment: [];
  decrement: [];
  remove: [];
}>();
</script>

<template>
  <article
    class="flex flex-col gap-4 border-b border-white/10 px-4 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
  >
    <div class="min-w-0 flex-1">
      <p class="font-medium text-white">{{ line.product_name }}</p>
      <p v-if="line.product_description" class="mt-1 line-clamp-2 text-sm text-slate-400">
        {{ line.product_description }}
      </p>
      <p class="mt-2 text-xs text-slate-500">{{ line.price }} each</p>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/25 text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="busy"
        aria-label="Remove from cart"
        @click="emit('remove')"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </article>
</template>
