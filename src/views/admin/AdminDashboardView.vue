<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Code, Coins, Package, Users } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/services/auth.service";
import type { AdminCurrency, AdminProduct, AdminStripeLog, AdminUser } from "@/type/admin.type";

const auth = useAuthStore();

const loading = ref(true);
const error = ref("");

const users = ref<AdminUser[]>([]);
const products = ref<AdminProduct[]>([]);
const allProducts = ref<AdminProduct[]>([]);
const currencies = ref<AdminCurrency[]>([]);
const logs = ref<AdminStripeLog[]>([]);

const stripeLogLimit = ref(50);

const pageTitle = computed(() => "Admin Dashboard");

const usersCount = computed(() => users.value.length);
const adminsCount = computed(() => users.value.filter((u) => u.role === "admin").length);

const productsCount = computed(() => products.value.length);
const deletedProductsCount = computed(() => Math.max(0, allProducts.value.length - products.value.length));

const currenciesCount = computed(() => currencies.value.length);
const defaultCurrency = computed(() => currencies.value.find((c) => c.is_default) ?? currencies.value[0] ?? null);

const topEventTypes = computed(() => {
  const map = new Map<string, number>();
  for (const l of logs.value) {
    const key = String(l.event_type ?? "unknown");
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([eventType, count]) => ({ eventType, count }));
});

const recentLogs = computed(() => logs.value.slice(0, 6));

const lastLog = computed(() => logs.value[0] ?? null);

const payloadKeysPreview = computed(() => {
  if (!lastLog.value) return [];
  try {
    return Object.keys(lastLog.value.payload ?? {}).slice(0, 8);
  } catch {
    return [];
  }
});

onMounted(async () => {
  loading.value = true;
  error.value = "";

  try {
    const [u, pActive, pAll, c, sLogs] = await Promise.all([
      adminService.listUsers(200),
      adminService.listProducts(false),
      adminService.listProducts(true),
      adminService.listCurrencies(),
      adminService.listStripeLogs(stripeLogLimit.value),
    ]);
    users.value = u;
    products.value = pActive;
    allProducts.value = pAll;
    currencies.value = c;
    logs.value = sLogs;
  } catch (e) {
    error.value = getApiErrorMessage(e, "Failed to load admin dashboard.");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="space-y-8">
    <div
      class="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.25),rgba(15,23,42,0.94),rgba(14,165,233,0.18))] p-8 shadow-2xl shadow-indigo-950/30"
    >
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <span
            class="inline-flex rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-indigo-200"
          >
            Control center
          </span>

          <h1 class="mt-4 text-4xl font-semibold tracking-tight text-white">
            {{ pageTitle }}
          </h1>

          <p class="mt-3 max-w-xl text-base leading-7 text-slate-300">
            A premium admin view over your StripeDesk system: user access, product catalog health,
            currency configuration, and live webhook event visibility.
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-200">
              <Users class="h-4 w-4 text-indigo-200" />
              {{ adminsCount }} admins
            </span>
            <span
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-200"
            >
              <Code class="h-4 w-4 text-indigo-200" />
              {{ logs.length }} recent events (limit: {{ stripeLogLimit }})
            </span>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Signed in</p>
            <p class="mt-2 text-lg font-medium text-white">
              {{ auth.user?.name ?? "Admin" }}
            </p>
            <p class="mt-1 text-sm text-slate-300">
              {{ auth.user?.email ?? "—" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5"
      >
        <div class="h-3 w-24 rounded bg-white/10" />
        <div class="mt-4 h-8 w-36 rounded bg-white/10" />
      </div>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <Users class="h-5 w-5 text-indigo-200/90" />
            <p class="text-sm text-slate-400">Users</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-semibold text-white">{{ usersCount }}</p>
          <p class="mt-2 text-sm text-slate-300">
            {{ adminsCount }} are admins
          </p>
        </div>
      </article>

      <article class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <Package class="h-5 w-5 text-indigo-200/90" />
          <p class="text-sm text-slate-400">Products</p>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-semibold text-white">{{ productsCount }}</p>
          <p class="mt-2 text-sm text-slate-300">
            {{ deletedProductsCount }} soft-deleted
          </p>
        </div>
      </article>

      <article class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <Coins class="h-5 w-5 text-indigo-200/90" />
          <p class="text-sm text-slate-400">Currencies</p>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-semibold text-white">{{ currenciesCount }}</p>
          <p class="mt-2 text-sm text-slate-300">
            Default: {{ defaultCurrency?.code ?? "—" }}
          </p>
        </div>
      </article>

      <article class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <Code class="h-5 w-5 text-indigo-200/90" />
          <p class="text-sm text-slate-400">Stripe events</p>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-semibold text-white">{{ logs.length }}</p>
          <p class="mt-2 text-sm text-slate-300">
            Top: {{ topEventTypes[0]?.eventType ?? "—" }}
          </p>
        </div>
      </article>
    </div>

    <div v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <article class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Quick actions</p>
            <h2 class="mt-2 text-2xl font-semibold text-white">Jump into admin tooling</h2>
          </div>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <router-link
            to="/admin/users"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Manage users
          </router-link>
          <router-link
            to="/admin/products"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Edit product catalog
          </router-link>
          <router-link
            to="/admin/currencies"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Currency configuration
          </router-link>
          <router-link
            to="/admin/stripe-logs"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Inspect Stripe events
          </router-link>
        </div>

        <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-sm font-medium text-white">What you can do here</p>
          <ul class="mt-3 space-y-2 text-sm text-slate-300">
            <li>Soft-delete users (prevents sign-in without hard removal).</li>
            <li>Create or update products and currencies.</li>
            <li>Inspect webhook payloads to debug live issues.</li>
          </ul>
        </div>
      </article>

      <article class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Recent event stream</p>

        <div class="mt-5 space-y-4">
          <div
            v-if="!recentLogs.length"
            class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
          >
            No Stripe logs loaded yet.
          </div>

          <div
            v-for="l in recentLogs"
            :key="l.id"
            class="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Event</p>
                <p class="mt-2 truncate text-sm font-semibold text-white">{{ l.event_type }}</p>
              </div>
              <span class="shrink-0 text-xs text-slate-500">{{ l.created_at }}</span>
            </div>
            <div v-if="payloadKeysPreview.length" class="mt-3 text-xs text-slate-300">
              Payload keys: <span class="font-medium text-slate-200">{{ payloadKeysPreview.join(", ") }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-sm font-medium text-white">Top event types</p>
          <div class="mt-3 space-y-2">
            <div
              v-for="t in topEventTypes"
              :key="t.eventType"
              class="flex items-center justify-between gap-4 text-sm text-slate-300"
            >
              <span class="truncate">{{ t.eventType }}</span>
              <span class="font-medium text-indigo-200">{{ t.count }}</span>
            </div>
            <div v-if="!topEventTypes.length" class="text-sm text-slate-400">No event distribution available.</div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

