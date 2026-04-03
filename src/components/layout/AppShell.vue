<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";

interface NavItem {
  label: string;
  to: string;
}

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const adminNav: NavItem[] = [{ label: "Admin", to: "/admin" }];

async function handleLogout() {
  auth.logout();
  await router.push("/login");
}
</script>

<template>
  <MainLayout v-if="auth.role !== 'admin'">
    <router-view />
  </MainLayout>

  <div v-else class="min-h-screen bg-slate-950 text-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_40%)]" />

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

          <span
            class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300 lg:hidden"
          >
            {{ auth.role }}
          </span>
        </div>

        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <nav class="flex flex-wrap gap-2">
            <router-link
              v-for="item in adminNav"
              :key="item.to"
              :to="item.to"
              class="rounded-full border px-4 py-2 text-sm transition-colors"
              :class="
                route.path === item.to
                  ? 'border-indigo-400/60 bg-indigo-500/15 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
              "
            >
              {{ item.label }}
            </router-link>
          </nav>

          <div
            class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div>
              <p class="text-sm font-medium text-white">{{ auth.user?.name ?? "Workspace user" }}</p>
              <p class="text-xs text-slate-400">{{ auth.user?.email ?? "signed-in account" }}</p>
            </div>

            <div class="flex items-center gap-3">
              <span
                class="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300 lg:inline-flex"
              >
                {{ auth.role }}
              </span>
              <button
                type="button"
                class="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
                @click="handleLogout"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <router-view />
    </main>
  </div>
</template>
