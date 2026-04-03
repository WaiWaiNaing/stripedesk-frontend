<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const stats = computed(() => [
  { label: "Monthly volume", value: "$128.4k", delta: "+12.4%" },
  { label: "Successful payments", value: "98.7%", delta: "+1.1%" },
  { label: "Active customers", value: "2,341", delta: "+184" },
  { label: "Open invoices", value: "18", delta: "-3 today" },
]);

const activity = [
  {
    title: "Product catalog synced",
    detail: "4 new payment plans were published to the shop.",
    time: "12 minutes ago",
  },
  {
    title: "Invoice reminder sent",
    detail: "Outstanding invoices were nudged automatically.",
    time: "1 hour ago",
  },
  {
    title: "Webhook delivery healthy",
    detail: "Stripe events have been stable for the last 24 hours.",
    time: "Today",
  },
];

const quickLinks = [
  { label: "Browse products", to: "/shop" },
  { label: "Review invoices", to: "/invoices" },
  { label: "Lookup a receipt", to: "/receipts" },
];
</script>

<template>
  <section class="space-y-8">
    <div
      class="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(79,70,229,0.25),rgba(15,23,42,0.9),rgba(14,165,233,0.18))] p-8 shadow-2xl shadow-indigo-950/30"
    >
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <span
            class="inline-flex rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-indigo-200"
          >
            Control center
          </span>
          <h1 class="mt-4 text-4xl font-semibold tracking-tight text-white">
            Welcome back, {{ auth.user?.name ?? "StripeDesk user" }}.
          </h1>
          <p class="mt-3 max-w-xl text-base leading-7 text-slate-300">
            This dashboard mirrors the second workspace's information architecture, now rebuilt as a
            TypeScript and Tailwind shell for your StripeDesk frontend.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
      >
        <p class="text-sm text-slate-400">{{ stat.label }}</p>
        <div class="mt-4 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold text-white">{{ stat.value }}</p>
          <span class="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
            {{ stat.delta }}
          </span>
        </div>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <article class="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Workspace summary</p>
            <h2 class="mt-2 text-2xl font-semibold text-white">Operational overview</h2>
          </div>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {{ auth.user?.role ?? "user" }}
          </span>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-slate-400">Primary account</p>
            <p class="mt-2 text-lg font-medium text-white">{{ auth.user?.email ?? "you@example.com" }}</p>
            <p class="mt-3 text-sm leading-6 text-slate-400">
              Use this area for profile, product, and invoice summaries as you wire live data into the
              new shell.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-sm text-slate-400">Launchpad</p>
            <ul class="mt-3 space-y-3 text-sm text-slate-300">
              <li>Products and checkout live under `Shop`.</li>
              <li>Invoice drill-downs live under `Invoices`.</li>
              <li>Receipt lookups and admin tooling have dedicated pages.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Recent activity</p>
        <div class="mt-6 space-y-4">
          <div
            v-for="item in activity"
            :key="item.title"
            class="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-medium text-white">{{ item.title }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-400">{{ item.detail }}</p>
              </div>
              <span class="whitespace-nowrap text-xs text-slate-500">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
