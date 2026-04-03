import { col, type ColumnDef } from "@/components/ui/table";
import type { AdminCurrency } from "@/type/admin.type";

export const adminCurrenciesColumns: Array<ColumnDef<AdminCurrency>> = [
  col<AdminCurrency>({ id: "code", header: "Code" }),
  col<AdminCurrency>({ id: "name", header: "Name" }),
  col<AdminCurrency>({ id: "symbol", header: "Symbol" }),
  col<AdminCurrency>({ id: "numeric_code", header: "Numeric" }),
  col<AdminCurrency>({ id: "minor_unit", header: "Minor" }),
  col<AdminCurrency>({ id: "is_default", header: "Default" }),
  col<AdminCurrency>({ id: "created_at", header: "Created" }),
  col<AdminCurrency>({ id: "actions", header: "Actions", align: "right" }),
];

