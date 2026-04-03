import type { Component } from "vue";

export type TableAlign = "left" | "center" | "right";

export interface ColumnDef<T> {
  /** Stable id used for slots: `cell-<id>` and `header-<id>` */
  id: string;
  header: string;
  align?: TableAlign;
  /** Optional accessor for default cell rendering. If omitted, DataTable will render an empty cell unless a slot is provided. */
  accessor?: (row: T) => unknown;
  /** Optional helper: for simple custom header icons/components */
  headerIcon?: Component;
  thClass?: string;
  tdClass?: string;
}

export function col<T>(def: ColumnDef<T>): ColumnDef<T> {
  return def;
}

