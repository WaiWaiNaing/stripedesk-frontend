<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductCard from "@/components/product/ProductCard.vue";
import { toast } from "@/lib/toast";
import { useAddCartItemMutation } from "@/query/cart.query";
import { useCartQuery } from "@/query/cart.query";
import { useShopProductQuery } from "@/query/product.query";
import { useAuthStore } from "@/stores/auth";
import type { Product } from "@/type/product.type";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const productsQuery = useShopProductQuery();
const addToCartMutation = useAddCartItemMutation();

const products = computed(() => productsQuery.data.value?.data ?? []);

const userId = computed(() => auth.user?.id ?? null);
const cartQuery = useCartQuery(userId);

const inCartProductIds = computed(() => {
  const lines = cartQuery.data.value?.data?.lines ?? [];
  return new Set<number>(lines.map((l) => l.product_id));
});

watch(
  () => productsQuery.isError.value,
  (failed) => {
    if (failed) toast.error("Failed to load products.");
  },
);

function redirectToLogin() {
  void router.push({
    name: "login",
    query: { redirect: route.fullPath },
  });
  toast.info("Sign in to use your cart.");
}

async function handleAddToCart(product: Product) {
  if (!auth.isAuthenticated) {
    redirectToLogin();
    return;
  }

  const userId = auth.user?.id;
  if (userId == null) return;

  try {
    await addToCartMutation.mutateAsync({
      userId,
      body: { product_id: product.id, quantity: 1 },
    });
    toast.success(`“${product.name}” added to your cart.`);
  } catch {
    toast.error("Could not add to cart. Try again.");
  }
}

async function handleBuyNow(product: Product) {
  if (!auth.isAuthenticated) {
    redirectToLogin();
    return;
  }

  const userId = auth.user?.id;
  if (userId == null) return;

  try {
    await addToCartMutation.mutateAsync({
      userId,
      body: { product_id: product.id, quantity: 1 },
    });
    await router.push({ name: "cart" });
  } catch {
    toast.error("Could not add to cart. Try again.");
  }
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Shop</p>
        <h1 class="mt-2 text-3xl font-semibold text-white">Product List</h1>
        <p v-if="!auth.isAuthenticated" class="mt-2 max-w-xl text-sm text-slate-400">
          Sign in to add items to your cart or buy now. You can browse the catalog without an
          account.
        </p>
      </div>
    </div>

    <div
      v-if="productsQuery.isLoading.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      Loading products…
    </div>

    <div
      v-else-if="productsQuery.isError.value"
      class="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
    >
      <p>Products could not be loaded.</p>
      <button
        type="button"
        class="mt-4 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
        @click="() => productsQuery.refetch()"
      >
        Retry
      </button>
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
        :in-cart="inCartProductIds.has(product.id)"
        @add-to-cart="handleAddToCart"
        @buy-now="handleBuyNow"
      />
    </div>
  </section>
</template>
