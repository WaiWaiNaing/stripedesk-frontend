<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

type AdminNavKey = "dashboard" | "users" | "products" | "currencies" | "stripeLogs";

const navItems: Array<{ key: AdminNavKey; label: string; to: string }> = [
  { key: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { key: "users", label: "Users", to: "/admin/users" },
  { key: "products", label: "Products", to: "/admin/products" },
  { key: "currencies", label: "Currencies", to: "/admin/currencies" },
  { key: "stripeLogs", label: "Stripe logs", to: "/admin/stripe-logs" },
];

const activeKey = computed<AdminNavKey>(() => {
  const parts = route.path.split("/").filter(Boolean);
  const seg = parts[1];
  if (!seg || seg === "dashboard") return "dashboard";
  if (seg === "stripe-logs") return "stripeLogs";
  return (seg as AdminNavKey) ?? "dashboard";
});

const activeTitle = computed(() => navItems.find((i) => i.key === activeKey.value)?.label ?? "Dashboard");

const activeSubtitle = computed(() => {
  switch (activeKey.value) {
    case "dashboard":
      return "Operational overview across users, catalog, currencies, and Stripe activity.";
    case "users":
      return "Manage admin users and access (soft-delete supported).";
    case "products":
      return "Create, edit, and soft-manage your product catalog.";
    case "currencies":
      return "Add currencies and control default display.";
    case "stripeLogs":
      return "Inspect Stripe webhook events and payloads.";
    default:
      return "";
  }
});
</script>

<template>
  <!-- Sidebar + page content; header is handled by AdminLayout -->
  <section class="flex min-h-0 flex-1 flex-col bg-slate-950">
    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        class="flex w-full shrink-0 flex-col border-b border-white/10 bg-slate-900/90 lg:w-60 lg:border-b-0 lg:border-r xl:w-64"
      >
        <nav
          class="flex flex-1 flex-col gap-0.5 p-2 sm:flex-row sm:overflow-x-auto lg:flex-col lg:p-3"
          aria-label="Admin sections"
        >
          <router-link
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="group flex w-full shrink-0 items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition sm:min-w-[8.5rem] lg:min-w-0 lg:px-3 lg:py-3"
            :class="
              activeKey === item.key
                ? 'bg-indigo-500/20 text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]'
                : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
            "
          >
            <span class="font-medium">{{ item.label }}</span>
            <span
              class="text-[10px] uppercase tracking-[0.2em]"
              :class="activeKey === item.key ? 'text-indigo-200/80' : 'text-slate-600 group-hover:text-slate-500'"
            >
              Panel
            </span>
          </router-link>
        </nav>

        <div class="hidden border-t border-white/5 p-3 text-[10px] leading-relaxed text-slate-600 lg:block">
          StripeDesk admin API · v1
        </div>
      </aside>

      <article class="relative min-h-0 min-w-0 flex-1 overflow-y-auto bg-slate-950/50">
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-0 h-14 bg-gradient-to-b from-indigo-500/[0.06] to-transparent"
          aria-hidden="true"
        />
        <div class="relative z-[1] px-4 pb-6 pt-3 sm:px-6 sm:pb-8 sm:pt-4 lg:px-8 lg:pb-10 lg:pt-5">
          <div class="mb-6 border-b border-white/5 pb-4 sm:mb-7 sm:pb-5">
            <p class="text-sm uppercase tracking-[0.28em] text-slate-500">{{ activeKey }}</p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">
              {{ activeTitle }}
            </h2>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {{ activeSubtitle }}
            </p>
          </div>

          <router-view />
        </div>
      </article>
    </div>
  </section>
</template>

