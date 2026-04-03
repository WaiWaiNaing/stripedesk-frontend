<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel.vue";
import AdminProductsPanel from "@/components/admin/AdminProductsPanel.vue";
import AdminCurrenciesPanel from "@/components/admin/AdminCurrenciesPanel.vue";

type AdminTab = "users" | "products" | "currencies" | "stripeLogs";

interface PanelItem {
  title: string;
  description: string;
}

const auth = useAuthStore();
const activeTab = ref<AdminTab>("users");

const tabs: Array<{ key: AdminTab; label: string }> = [
  { key: "users", label: "Users" },
  { key: "products", label: "Products" },
  { key: "currencies", label: "Currencies" },
  { key: "stripeLogs", label: "Stripe logs" },
];

const stripePanelItems: PanelItem[] = [
  { title: "Webhook deliveries", description: "Trace incoming Stripe events and retries." },
  { title: "Incident audit", description: "Inspect failed deliveries and remediation notes." },
];
</script>

<template>
  <!-- Fills AdminLayout main: full-bleed under admin header -->
  <section class="flex min-h-0 flex-1 flex-col bg-slate-950">
    <div
      v-if="auth.role !== 'admin'"
      class="mx-auto max-w-3xl px-4 py-10 sm:px-6"
    >
      <div class="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 text-sm text-amber-100">
        Admin access is required to use these controls.
      </div>
    </div>

    <template v-else>
      <!-- Sidebar + main (single header lives in AdminLayout only) -->
      <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          class="flex w-full shrink-0 flex-col border-b border-white/10 bg-slate-900/90 lg:w-60 lg:border-b-0 lg:border-r xl:w-64"
        >
          <nav
            class="flex flex-1 flex-col gap-0.5 p-2 sm:flex-row sm:overflow-x-auto lg:flex-col lg:p-3"
            aria-label="Admin sections"
          >
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="group flex w-full shrink-0 items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition sm:min-w-[8.5rem] lg:min-w-0 lg:px-3 lg:py-3"
              :class="
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-white shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
              "
              @click="activeTab = tab.key"
            >
              <span class="font-medium">{{ tab.label }}</span>
              <span
                class="text-[10px] uppercase tracking-[0.2em]"
                :class="activeTab === tab.key ? 'text-indigo-200/80' : 'text-slate-600 group-hover:text-slate-500'"
              >
                Panel
              </span>
            </button>
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
          <div class="relative z-[1] px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 lg:px-8 lg:pb-8">
            <div class="mb-4 border-b border-white/5 pb-4 sm:mb-5 sm:pb-5">
              <p class="text-sm uppercase tracking-[0.28em] text-slate-500">{{ activeTab }}</p>
              <h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">
                {{ tabs.find((tab) => tab.key === activeTab)?.label }}
              </h2>
            </div>

            <AdminUsersPanel v-if="activeTab === 'users'" />
            <AdminProductsPanel v-else-if="activeTab === 'products'" />
            <AdminCurrenciesPanel v-else-if="activeTab === 'currencies'" />
            <div v-else class="grid gap-4 md:grid-cols-2">
              <div
                v-for="item in stripePanelItems"
                :key="item.title"
                class="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 class="text-base font-medium text-white">{{ item.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-400">{{ item.description }}</p>
                <p class="mt-4 text-xs text-slate-600">
                  Wire
                  <code class="rounded bg-black/30 px-1 py-0.5 text-slate-400">GET /api/v1/admin/stripe-logs</code>
                  here when you want a live log grid.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>
