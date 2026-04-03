<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import UserProfileMenu from "@/components/core/UserProfileMenu.vue";
import { FileText, LayoutDashboard, Receipt, ShoppingBag, ShoppingCart } from "@lucide/vue";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const route = useRoute();

const navItems = computed<NavItem[]>(() => [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Shop", to: "/shop", icon: ShoppingBag },
  { label: "Cart", to: "/cart", icon: ShoppingCart },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Receipts", to: "/receipts", icon: Receipt },
]);
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <div class="flex items-center justify-between gap-4">
        <router-link to="/dashboard" class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-semibold text-white"
          >
            SD
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.32em] text-indigo-300/80">StripeDesk</p>
            <p class="text-sm text-slate-400">Payments workspace</p>
          </div>
        </router-link>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <nav class="flex flex-wrap gap-2">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex h-10 items-center rounded-full border text-sm transition-colors"
            :class="
              route.path === item.to
                ? 'w-auto px-4 border-indigo-400/60 bg-indigo-500/15 text-white'
                : 'w-10 justify-center border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
            "
            :aria-label="item.label"
          >
            <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
            <span v-if="route.path === item.to" class="ml-2 font-medium">{{ item.label }}</span>
            <span v-else class="sr-only">{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="flex items-center justify-end lg:justify-center">
          <UserProfileMenu />
        </div>
      </div>
    </div>
  </header>
</template>
