<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RefreshCw, Search, Code } from "@lucide/vue";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/services/auth.service";
import { useDebouncedRef } from "@/utils/debounce";
import type { AdminStripeLog } from "@/type/admin.type";
import DataTable from "@/components/ui/DataTable.vue";
import { adminStripeLogsColumns } from "@/components/admin/columns/adminStripeLogs.columns";

const items = ref<AdminStripeLog[]>([]);
const loading = ref(true);
const error = ref("");

const limit = ref(100);
const { source: search, debounced: searchDebounced } = useDebouncedRef("", 300);

const selectedLog = ref<AdminStripeLog | null>(null);

const filtered = computed(() => {
  const q = searchDebounced.value.trim().toLowerCase();
  if (!q) return items.value;

  return items.value.filter((r) => {
    const eventType = String(r.event_type ?? "").toLowerCase();
    if (eventType.includes(q)) return true;
    try {
      const payload = JSON.stringify(r.payload ?? {}).toLowerCase();
      return payload.includes(q);
    } catch {
      return false;
    }
  });
});

async function load() {
  loading.value = true;
  error.value = "";
  try {
    items.value = await adminService.listStripeLogs(limit.value);
  } catch (e) {
    error.value = getApiErrorMessage(e, "Failed to load Stripe logs.");
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-slate-400">
        <Code class="h-5 w-5 text-indigo-300/80" />
        <span class="text-sm">Stripe webhook events</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model.number="limit"
          class="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white"
          @change="load"
        >
          <option :value="25">25 rows</option>
          <option :value="50">50 rows</option>
          <option :value="100">100 rows</option>
          <option :value="200">200 rows</option>
        </select>

        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            v-model="search"
            type="search"
            placeholder="Search event type or payload…"
            class="w-[18rem] rounded-xl border border-white/10 bg-slate-950/80 px-10 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
          />
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-slate-900"
          @click="load"
          :disabled="loading"
        >
          <RefreshCw class="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {{ error }}
    </div>

    <DataTable
      :rows="filtered"
      :columns="adminStripeLogsColumns"
      :loading="loading"
      empty-text="No logs found."
      :row-key="(row: AdminStripeLog) => row.id"
      min-width-class="min-w-[820px]"
    >
      <template #cell-id="{ row }">
        <span class="font-mono text-slate-400">{{ (row as AdminStripeLog).id }}</span>
      </template>

      <template #cell-event_type="{ row }">
        <div class="max-w-[320px] truncate font-medium text-slate-200">
          {{ (row as AdminStripeLog).event_type }}
        </div>
      </template>

      <template #cell-created_at="{ row }">
        <span class="text-slate-400">{{ (row as AdminStripeLog).created_at }}</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/30 px-3 py-1.5 text-xs text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
            @click="selectedLog = row as AdminStripeLog"
          >
            View payload
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Payload modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
        <div class="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Event payload</p>
            <p class="mt-1 truncate text-sm font-semibold text-white">{{ selectedLog.event_type }}</p>
          </div>
          <button
            type="button"
            class="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
            @click="selectedLog = null"
          >
            Close
          </button>
        </div>

        <div class="max-h-[70vh] overflow-auto p-4">
          <pre class="whitespace-pre-wrap break-words text-xs leading-5 text-slate-200">
{{ JSON.stringify(selectedLog.payload, null, 2) }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

