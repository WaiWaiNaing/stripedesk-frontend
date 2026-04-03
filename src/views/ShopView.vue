<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/product/ProductCard.vue";
import { useAddCartItemMutation } from "@/query/cart.query";
import { useProductQuery } from "@/query/product.query";
import { useAuthStore } from "@/stores/auth";
import type { Product } from "@/type/product.type";

const auth = useAuthStore();
const router = useRouter();
const productsQuery = useProductQuery();
const addToCartMutation = useAddCartItemMutation();

const products = computed(() => productsQuery.data.value?.data ?? []);

const shopMessage = ref<string | null>(null);
let shopMessageTimer: ReturnType<typeof setTimeout> | null = null;

function showShopMessage(text: string) {
  shopMessage.value = text;
  if (shopMessageTimer) clearTimeout(shopMessageTimer);
  shopMessageTimer = setTimeout(() => {
    shopMessage.value = null;
    shopMessageTimer = null;
  }, 3200);
}

onUnmounted(() => {
  if (shopMessageTimer) clearTimeout(shopMessageTimer);
});

async function handleAddToCart(product: Product) {
  const userId = auth.user?.id;
  if (userId == null) return;

  try {
    await addToCartMutation.mutateAsync({
      userId,
      body: { product_id: product.id, quantity: 1 },
    });
    showShopMessage(`“${product.name}” added to your cart.`);
  } catch {
    showShopMessage("Could not add to cart. Try again.");
  }
}

async function handleBuyNow(product: Product) {
  const userId = auth.user?.id;
  if (userId == null) return;

  try {
    await addToCartMutation.mutateAsync({
      userId,
      body: { product_id: product.id, quantity: 1 },
    });
    await router.push({ name: "cart" });
  } catch {
    showShopMessage("Could not add to cart. Try again.");
  }
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Shop</p>
        <h1 class="mt-2 text-3xl font-semibold text-white">Product List</h1>
      </div>
    </div>

    <p
      v-if="shopMessage"
      class="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
      role="status"
    >
      {{ shopMessage }}
    </p>

    <div
      v-if="productsQuery.isLoading.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      Loading products…
    </div>

    <div
      v-else-if="productsQuery.isError.value"
      class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
    >
      Failed to load products.
    </div>

    <div
      v-else-if="products.length === 0"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      No products available.
    </div>

    <div v-else class="grid gap-5 lg:grid-cols-3">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        variant="solid"
        @add-to-cart="handleAddToCart"
        @buy-now="handleBuyNow"
      />
    </div>
  </section>
</template>
