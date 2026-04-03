<script setup lang="ts">
import type { Product } from "@/type/product.type";
import AppButton from "../ui/AppButton.vue";

type Variant = "transparent" | "solid";

interface Props {
  product: Product;
  variant?: Variant;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
});

const emit = defineEmits<{
  "add-to-cart": [product: Product];
  "buy-now": [product: Product];
}>();

function formatPrice() {
  const suffix = props.product.currency_code ? ` ${props.product.currency_code}` : "";
  return `${props.product.price}${suffix}`;
}

function handleAddToCart() {
  emit("add-to-cart", props.product);
}

function handleBuyNow() {
  emit("buy-now", props.product);
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-3xl border p-6 transition"
    :class="
      variant === 'transparent'
        ? 'border-white/10 bg-transparent hover:border-white/20'
        : 'border-white/10 bg-white/5 hover:border-white/20'
    "
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Product</p>
        <h3 class="mt-2 text-xl font-semibold text-white">{{ product.name }}</h3>
      </div>

      <div
        class="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm font-semibold text-white"
      >
        {{ formatPrice() }}
      </div>
    </div>

    <p class="mt-4 text-sm leading-6 line-clamp-2 h-13 text-slate-300">
      {{ product.description ?? "No description provided." }}
    </p>

    <div class="mt-6 grid gap-2 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
        @click="handleAddToCart"
      >
        Add to cart
      </button>

      <AppButton class="w-full text-sm" @click="handleBuyNow"> Buy now </AppButton>
    </div>
  </article>
</template>
