<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserProfileMenu from "@/components/core/UserProfileMenu.vue";
import type { Component } from "vue";
import {
  FileText,
  LogOut,
  Menu,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  X,
} from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";

interface NavItem {
  label: string;
  to: string;
  icon: Component;
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const mobileOpen = ref(false);

function setBodyScrollLocked(locked: boolean) {
  if (typeof document === "undefined") return;
  const value = locked ? "hidden" : "";
  document.body.style.overflow = value;
  document.documentElement.style.overflow = value;
}

watch(mobileOpen, (open) => {
  setBodyScrollLocked(open);
});

onUnmounted(() => {
  setBodyScrollLocked(false);
});

const navItems = computed<NavItem[]>(() => [
  { label: "Shop", to: "/shop", icon: ShoppingBag },
  { label: "Cart", to: "/cart", icon: ShoppingCart },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Receipts", to: "/receipts", icon: Receipt },
]);

const initials = computed(() => {
  const name = auth.user?.name?.trim() ?? "";
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const displayName = computed(() => auth.user?.name ?? "Workspace user");
const displayEmail = computed(() => auth.user?.email ?? "signed-in account");

function closeMobile() {
  mobileOpen.value = false;
}

async function handleMobileLogout() {
  closeMobile();
  auth.logout();
  await router.push("/login");
}

watch(
  () => route.path,
  () => {
    closeMobile();
  },
);
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <div class="flex items-center justify-between gap-4">
        <router-link to="/" class="flex items-center gap-3">
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

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10 lg:hidden"
          aria-label="Open menu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = true"
        >
          <Menu class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div class="hidden flex-col gap-4 lg:flex lg:flex-row lg:items-center lg:gap-6">
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

        <div class="flex items-center justify-end gap-2 lg:justify-center">
          <UserProfileMenu v-if="auth.isAuthenticated" />
          <template v-else>
            <router-link
              to="/login"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-white transition hover:border-indigo-400/60 hover:bg-indigo-500/25"
            >
              Register
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Teleport to="body">
      <div
        v-show="mobileOpen"
        class="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          aria-hidden="true"
          @click="closeMobile"
        />

        <div
          class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-white/10 bg-slate-950 shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <p class="text-sm font-semibold text-white">Menu</p>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              aria-label="Close menu"
              @click="closeMobile"
            >
              <X class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div class="border-b border-white/10 px-4 py-5">
            <div v-if="auth.isAuthenticated" class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500/80 to-amber-600/80 text-sm font-semibold text-white shadow-inner shadow-black/20"
              >
                {{ initials }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-white">{{ displayName }}</p>
                <p class="truncate text-xs text-slate-400">{{ displayEmail }}</p>
              </div>
            </div>
            <div v-else class="text-sm text-slate-400">
              <p class="font-medium text-white">Browsing as guest</p>
              <p class="mt-1 text-xs">Sign in to save your cart and complete checkout.</p>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 py-4">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
              :class="
                route.path === item.to
                  ? 'bg-indigo-500/15 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              "
              @click="closeMobile"
            >
              <component :is="item.icon" class="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
              {{ item.label }}
            </router-link>
          </nav>

          <div class="border-t border-white/10 p-4">
            <template v-if="auth.isAuthenticated">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/15"
                @click="handleMobileLogout"
              >
                <LogOut class="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </template>
            <div v-else class="grid gap-2">
              <router-link
                to="/login"
                class="flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                @click="closeMobile"
              >
                Sign in
              </router-link>
              <router-link
                to="/register"
                class="flex w-full items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500/25"
                @click="closeMobile"
              >
                Create account
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
