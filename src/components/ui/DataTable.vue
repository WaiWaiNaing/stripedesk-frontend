<script setup lang="ts">
import { computed } from "vue";
import { Loader2 } from "@lucide/vue";
import TableCell from "@/components/ui/TableCell.vue";
import type { ColumnDef } from "@/components/ui/table";

const props = withDefaults(
  defineProps<{
    rows: unknown[];
    columns: Array<ColumnDef<any>>;
    rowKey?: (row: any, index: number) => string | number;
    loading?: boolean;
    emptyText?: string;
    minWidthClass?: string;
  }>(),
  {
    rows: () => [],
    columns: () => [],
    rowKey: (_row: any, index: number) => index,
    loading: false,
    emptyText: "No records found.",
    minWidthClass: "min-w-[640px]",
  },
);

const hasRows = computed(() => (props.rows?.length ?? 0) > 0);

function alignToTh(align?: "left" | "center" | "right") {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-white/10">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm" :class="[minWidthClass]">
        <thead class="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th
              v-for="col in columns"
              :key="col.id"
              class="px-4 py-3 font-medium"
              :class="[alignToTh(col.align), col.thClass]"
            >
              <slot :name="`header-${col.id}`" :column="col">
                {{ col.header }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-white/5">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-12 text-center text-slate-500">
              <slot name="loading">
                <Loader2 class="mx-auto h-8 w-8 animate-spin text-indigo-400/60" />
              </slot>
            </td>
          </tr>

          <tr v-else-if="!hasRows">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-slate-500">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>

          <tr
            v-for="(row, index) in rows"
            v-else
            :key="rowKey(row, index)"
            class="transition hover:bg-white/[0.02]"
          >
            <TableCell
              v-for="col in columns"
              :key="col.id"
              :align="col.align"
              :class="col.tdClass"
            >
              <slot :name="`cell-${col.id}`" :row="row" :column="col">
                <span class="text-slate-300">
                  {{
                    col.accessor
                      ? String(col.accessor(row) ?? "")
                      : ""
                  }}
                </span>
              </slot>
            </TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

