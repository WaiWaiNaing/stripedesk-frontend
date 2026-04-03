<script setup lang="ts">
import type { Product } from "@/type/product.type";
import { ref } from "vue";
import AlertModalBox from "@/components/common/AlertModalBox.vue";
import AppButton from "../ui/AppButton.vue";

type Variant = "transparent" | "solid";

interface Props {
  product: Product;
  variant?: Variant;
  /** True when this product is already present in user's active cart. */
  inCart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  inCart: false,
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

const buyNowOpen = ref(false);

function openBuyNowConfirm() {
  buyNowOpen.value = true;
}

function confirmBuyNow() {
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

    <div class="mt-6 grid gap-2" :class="props.inCart ? 'sm:grid-cols-1' : 'sm:grid-cols-2'">
      <button
        type="button"
        :disabled="props.inCart"
        :class="
          props.inCart
            ? 'cursor-not-allowed opacity-60 hover:border-white/10 hover:bg-white/5'
            : 'hover:border-white/20 hover:bg-white/10'
        "
        class="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleAddToCart"
      >
        {{ props.inCart ? "This item is already in your cart" : "Add to cart" }}
      </button>

      <AppButton v-if="!props.inCart" class="w-full text-sm" @click="openBuyNowConfirm">
        Buy now
      </AppButton>
    </div>

    <AlertModalBox
      v-model="buyNowOpen"
      title="Confirm purchase"
      :description="`Buy ${product.name} for ${formatPrice()}? You will be taken to your cart to complete checkout.`"
      confirm-text="Continue"
      cancel-text="Not now"
      @confirm="confirmBuyNow"
    />
  </article>
</template>
