<script setup lang="ts">
import { LayoutDashboard } from "@lucide/vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  auth.logout();
  await router.push("/login");
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-950 text-slate-100">
    <div
      class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_40%)]"
    />

    <!-- Single admin chrome row: console branding | account (admin-only layout) -->
    <header class="sticky top-0 z-20 shrink-0 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div
        class="flex h-11 flex-nowrap items-center justify-between gap-3 overflow-hidden px-3 sm:h-12 sm:gap-4 sm:px-5 lg:px-6"
      >
        <router-link
          to="/admin"
          class="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/15 text-indigo-200"
          >
            <LayoutDashboard class="h-4 w-4" />
          </div>
          <div class="min-w-0 leading-tight">
            <p class="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Console</p>
            <p class="truncate text-sm font-semibold text-white sm:text-base">Administration</p>
          </div>
        </router-link>

        <div class="flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-2">
          <span
            class="hidden max-w-[9rem] truncate text-xs leading-none text-slate-500 sm:inline md:max-w-[11rem] lg:max-w-[14rem]"
            :title="auth.user?.email ?? undefined"
          >
            {{ auth.user?.email }}
          </span>
          <span
            class="shrink-0 rounded-md border border-indigo-400/35 bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200 sm:px-2"
          >
            Admin
          </span>
          <button
            type="button"
            class="shrink-0 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs font-medium leading-none text-slate-200 transition hover:border-white/20 hover:bg-slate-800 sm:px-2.5 sm:py-1.5"
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </div>
    </header>

    <main class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <router-view />
    </main>
  </div>
</template>
