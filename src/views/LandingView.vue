<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import {
  ArrowRight,
  CreditCard,
  FileText,
  Lock,
  Package,
  Shield,
  ShoppingCart,
  Sparkles,
} from "@lucide/vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/auth";
import { usePublicProductPreviewQuery } from "@/query/product.query";
import type { Product } from "@/type/product.type";
import ProductCard from "@/components/product/ProductCard.vue";

const auth = useAuthStore();
const productsQuery = usePublicProductPreviewQuery();

const previewProducts = computed<Product[]>(() => {
  const res = productsQuery.data.value;
  if (!res?.success) return [];
  return res.data.slice(0, 3);
});

function formatPrice(product: Product) {
  const suffix = product.currency_code ? ` ${product.currency_code}` : "";
  return `${product.price}${suffix}`;
}

const features = [
  {
    title: "Stripe Checkout",
    body: "Hosted checkout sessions with your catalog prices—fewer moving parts at payment time.",
    icon: CreditCard,
  },
  {
    title: "Account & roles",
    body: "JWT-backed sessions with a clear split between customers and operators who manage the system.",
    icon: Lock,
  },
  {
    title: "Invoices & receipts",
    body: "Keep purchase history organized with invoice summaries and receipt-friendly flows after payment.",
    icon: FileText,
  },
] as const;

const steps = [
  {
    step: "1",
    title: "Browse the shop",
    body: "Review products and pricing in one place. Your cart stays tied to your signed-in account.",
  },
  {
    step: "2",
    title: "Pay securely",
    body: "Continue to Stripe Checkout when you are ready. You will leave this app briefly to complete payment.",
  },
  {
    step: "3",
    title: "Track what you bought",
    body: "Use invoices and receipts in the app to refer back to orders without digging through email.",
  },
] as const;
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.28),transparent_45%)]"
    />

    <header class="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <RouterLink to="/" class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-semibold text-white"
          >
            SD
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.32em] text-indigo-300/80">StripeDesk</p>
            <p class="text-sm text-slate-400">Payments workspace</p>
          </div>
        </RouterLink>

        <nav class="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <template v-if="auth.isAuthenticated">
            <RouterLink
              to="/shop"
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              Shop
            </RouterLink>
            <RouterLink
              to="/cart"
              class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              <ShoppingCart class="h-4 w-4" aria-hidden="true" />
              Cart
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-white transition hover:border-indigo-400/60 hover:bg-indigo-500/25"
            >
              Create account
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section
        class="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20"
      >
        <div class="mx-auto max-w-3xl text-center">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200/90"
          >
            <Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
            Commerce & billing
          </div>
          <h1
            class="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            Sell plans and collect payments without juggling five different tools
          </h1>
          <p class="mt-5 text-lg leading-relaxed text-slate-400">
            StripeDesk brings together a product catalog, cart, Stripe Checkout, and post-purchase
            paperwork so your team and your customers share one calm workflow—from first click to
            paid invoice.
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <RouterLink
              v-if="!auth.isAuthenticated"
              to="/login"
              class="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-[10px] border border-white/15 bg-transparent px-5 py-3 text-[15px] font-semibold text-white transition hover:border-white/25 hover:bg-white/5 sm:w-auto"
            >
              Sign in to purchase
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <div
            class="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 text-center backdrop-blur-sm"
          >
            <p class="text-2xl font-semibold text-white">Stripe</p>
            <p class="mt-1 text-xs uppercase tracking-wider text-slate-500">Checkout-ready</p>
          </div>
          <div
            class="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 text-center backdrop-blur-sm"
          >
            <p class="text-2xl font-semibold text-white">JWT</p>
            <p class="mt-1 text-xs uppercase tracking-wider text-slate-500">Signed-in sessions</p>
          </div>
          <div
            class="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 text-center backdrop-blur-sm"
          >
            <p class="text-2xl font-semibold text-white">One app</p>
            <p class="mt-1 text-xs uppercase tracking-wider text-slate-500">Shop to receipt</p>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section
        class="relative z-10 border-y border-white/10 bg-slate-950/50 py-16 sm:py-20"
        aria-labelledby="features-heading"
      >
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 id="features-heading" class="text-2xl font-semibold text-white sm:text-3xl">
              What you get in this workspace
            </h2>
            <p class="mt-3 text-slate-400">
              The app is opinionated on purpose: fewer tabs, clearer ownership between storefront
              activity and back-office administration.
            </p>
          </div>
          <div class="mt-12 grid gap-6 md:grid-cols-3">
            <article
              v-for="item in features"
              :key="item.title"
              class="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15"
            >
              <div
                class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200"
              >
                <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 class="text-lg font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-400">{{ item.body }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="relative z-10 py-16 sm:py-20" aria-labelledby="steps-heading">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 id="steps-heading" class="text-2xl font-semibold text-white sm:text-3xl">
              How a purchase flows
            </h2>
            <p class="mt-3 text-slate-400">
              Whether you are trying the catalog for the first time or coming back for another seat,
              the path stays the same.
            </p>
          </div>
          <ol class="mt-12 grid gap-8 md:grid-cols-3">
            <li
              v-for="row in steps"
              :key="row.step"
              class="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-transparent p-6"
            >
              <span
                class="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900 text-sm font-semibold text-indigo-300"
              >
                {{ row.step }}
              </span>
              <h3 class="text-lg font-semibold text-white">{{ row.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-400">{{ row.body }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- Product preview -->
      <section
        class="relative z-10 border-t border-white/10 bg-slate-950/40 py-16 sm:py-20"
        aria-labelledby="preview-heading"
      >
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Catalog preview</p>
              <h2 id="preview-heading" class="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                A taste of the catalog
              </h2>
              <p class="mt-2 max-w-xl text-slate-400">
                We show up to three active products here. Open the shop for the full list, cart
                actions, and checkout when you are signed in.
              </p>
            </div>
            <RouterLink
              to="/shop"
              class="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200"
            >
              View full shop
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </RouterLink>
          </div>

          <div v-if="productsQuery.isLoading.value" class="mt-10 grid gap-5 md:grid-cols-3">
            <div
              v-for="n in 3"
              :key="n"
              class="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          </div>

          <div
            v-else-if="productsQuery.isError.value || previewProducts.length === 0"
            class="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400"
          >
            <div class="mx-auto flex max-w-md flex-col items-center gap-3">
              <Package class="h-10 w-10 text-slate-600" aria-hidden="true" />
              <p v-if="productsQuery.isError.value">
                We could not load a public preview (the catalog may require signing in). Use the
                shop after you sign in to see live products.
              </p>
              <p v-else>No products are available to preview yet.</p>
              <RouterLink
                to="/shop"
                class="mt-2 inline-flex text-sm font-medium text-indigo-300 underline underline-offset-4 hover:text-indigo-200"
              >
                Go to shop
              </RouterLink>
            </div>
          </div>

          <div v-else class="mt-10 grid gap-5 md:grid-cols-3">
            <ProductCard
              v-for="product in previewProducts"
              :key="product.id"
              :product="product"
              variant="transparent"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
