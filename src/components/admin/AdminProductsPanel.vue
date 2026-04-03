<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { Loader2, Package, Pencil, Plus } from "@lucide/vue";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/services/auth.service";
import type { AdminCurrency, AdminProduct } from "@/type/admin.type";
import { useDebouncedRef } from "@/utils/debounce";
import DataTable from "@/components/ui/DataTable.vue";
import { adminProductsColumns } from "@/components/admin/columns/adminProducts.columns";

const items = ref<AdminProduct[]>([]);
const currencies = ref<AdminCurrency[]>([]);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const notice = ref("");
const includeDeleted = ref(false);
const { source: search, debounced: searchDebounced } = useDebouncedRef("", 300);

const form = reactive({
  name: "",
  description: "",
  price: 9.99 as number,
  currency_code: "USD",
});

const editOpen = ref(false);
const editId = ref<number | null>(null);
const editForm = reactive({
  name: "",
  description: "",
  price: 0 as number,
  currency_code: "USD",
});

const filtered = computed(() => {
  const q = searchDebounced.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((r) => {
    const blob = [r.name, r.description, r.currency_code, r.stripe_price_id, r.price]
      .map((x) => String(x ?? ""))
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
});

const tableColumns = computed(() =>
  includeDeleted.value ? adminProductsColumns : adminProductsColumns.filter((c) => c.id !== "status"),
);

async function loadCurrencies() {
  try {
    currencies.value = await adminService.listCurrencies();
    if (!form.currency_code && currencies.value.length) {
      const d =
        currencies.value.find((c) => c.is_default) ?? currencies.value[0] ?? null;
      if (d) form.currency_code = d.code;
    }
  } catch {
    /* table can still load */
  }
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    items.value = await adminService.listProducts(includeDeleted.value);
  } catch (e) {
    error.value = getApiErrorMessage(e, "Failed to load products.");
  } finally {
    loading.value = false;
  }
}

function onToggleDeleted() {
  void load();
}

async function submitCreate() {
  notice.value = "";
  if (!form.name.trim() || !form.currency_code) {
    error.value = "Name and currency are required.";
    return;
  }
  saving.value = true;
  error.value = "";
  const desc = form.description.trim();
  try {
    await adminService.createProduct({
      name: form.name.trim(),
      description: desc === "" ? null : desc,
      price: form.price,
      currency_code: form.currency_code,
    });
    notice.value = "Product created.";
    form.name = "";
    form.description = "";
    form.price = 9.99;
    await load();
  } catch (e) {
    error.value = getApiErrorMessage(e, "Create failed.");
  } finally {
    saving.value = false;
  }
}

function openEdit(row: AdminProduct) {
  if (row.deleted_at) return;
  editId.value = row.id;
  editForm.name = row.name ?? "";
  editForm.description = row.description ?? "";
  editForm.price = Number(row.price) || 0;
  editForm.currency_code = row.currency_code ?? "";
  editOpen.value = true;
  error.value = "";
}

function closeEdit() {
  editOpen.value = false;
  editId.value = null;
}

async function saveEdit() {
  if (editId.value == null) return;
  saving.value = true;
  error.value = "";
  const d = editForm.description.trim();
  try {
    await adminService.updateProduct(editId.value, {
      name: editForm.name.trim(),
      description: d === "" ? null : d,
      price: editForm.price,
      currency_code: editForm.currency_code,
    });
    notice.value = "Product updated.";
    closeEdit();
    await load();
  } catch (e) {
    error.value = getApiErrorMessage(e, "Update failed.");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadCurrencies();
  await load();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-slate-400">
        <Package class="h-5 w-5 text-indigo-300/80" />
        <span class="text-sm">Catalog</span>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
          <input
            v-model="includeDeleted"
            type="checkbox"
            class="rounded border-white/20 bg-slate-950 text-indigo-500"
            @change="onToggleDeleted"
          />
          Include deleted
        </label>
        <input
          v-model="search"
          type="search"
          placeholder="Search…"
          class="w-48 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
      </div>
    </div>

    <div
      v-if="error && !editOpen"
      class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {{ error }}
    </div>
    <div
      v-if="notice"
      class="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
    >
      {{ notice }}
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Create product</p>
      <form class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4" @submit.prevent="submitCreate">
        <input
          v-model="form.name"
          placeholder="Name"
          class="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
        <input
          v-model="form.description"
          placeholder="Description (optional)"
          class="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
        <input
          v-model.number="form.price"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Price"
          class="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
        <select
          v-model="form.currency_code"
          class="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-indigo-400/50 focus:outline-none"
        >
          <option v-for="c in currencies" :key="c.code" :value="c.code">
            {{ c.code }} — {{ c.name }}
          </option>
        </select>
        <div class="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            <Plus v-if="!saving" class="h-4 w-4" />
            <Loader2 v-else class="h-4 w-4 animate-spin" />
            Create product
          </button>
        </div>
      </form>
    </div>

    <DataTable
      :rows="filtered"
      :columns="tableColumns"
      :loading="loading"
      empty-text="No products."
      :row-key="(row: AdminProduct) => row.id"
      min-width-class="min-w-[800px]"
    >
      <template #cell-id="{ row }">
        <span class="font-mono text-slate-400">{{ (row as AdminProduct).id }}</span>
      </template>

      <template #cell-name="{ row }">
        <span class="font-medium text-white">{{ (row as AdminProduct).name }}</span>
      </template>

      <template #cell-price="{ row }">
        <span class="text-slate-300">{{ (row as AdminProduct).price }}</span>
      </template>

      <template #cell-currency_code="{ row }">
        <span class="text-slate-400">{{ (row as AdminProduct).currency_code }}</span>
      </template>

      <template #cell-stripe_price_id="{ row }">
        <span class="max-w-[140px] truncate font-mono text-xs text-slate-500">
          {{ (row as AdminProduct).stripe_price_id ?? "—" }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span
          v-if="(row as AdminProduct).deleted_at"
          class="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-200"
        >
          Deleted
        </span>
        <span
          v-else
          class="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200"
        >
          Active
        </span>
      </template>

      <template #cell-created_at="{ row }">
        <span class="text-slate-500">{{ (row as AdminProduct).created_at }}</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end">
          <button
            type="button"
            :disabled="!!(row as AdminProduct).deleted_at"
            class="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            @click="openEdit(row as AdminProduct)"
          >
            <Pencil class="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </template>
    </DataTable>

    <Teleport to="body">
      <div
        v-if="editOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        @click.self="closeEdit"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-indigo-950/40"
        >
          <h3 class="text-lg font-semibold text-white">Edit product</h3>
          <div class="mt-4 space-y-3">
            <input
              v-model="editForm.name"
              placeholder="Name"
              class="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-indigo-400/50 focus:outline-none"
            />
            <input
              v-model="editForm.description"
              placeholder="Description"
              class="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-indigo-400/50 focus:outline-none"
            />
            <input
              v-model.number="editForm.price"
              type="number"
              min="0.01"
              step="0.01"
              class="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-indigo-400/50 focus:outline-none"
            />
            <select
              v-model="editForm.currency_code"
              class="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-indigo-400/50 focus:outline-none"
            >
              <option v-for="c in currencies" :key="c.code" :value="c.code">
                {{ c.code }} — {{ c.name }}
              </option>
            </select>
          </div>
          <p v-if="error && editOpen" class="mt-3 text-sm text-red-300">{{ error }}</p>
          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              @click="closeEdit"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="saving"
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
              @click="saveEdit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
