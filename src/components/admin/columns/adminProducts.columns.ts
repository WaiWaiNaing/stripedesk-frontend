import { col, type ColumnDef } from "@/components/ui/table";
import type { AdminProduct } from "@/type/admin.type";

export const adminProductsColumns: Array<ColumnDef<AdminProduct>> = [
  col<AdminProduct>({ id: "id", header: "ID" }),
  col<AdminProduct>({ id: "name", header: "Name" }),
  col<AdminProduct>({ id: "price", header: "Price" }),
  col<AdminProduct>({ id: "currency_code", header: "Currency" }),
  col<AdminProduct>({ id: "stripe_price_id", header: "Stripe price" }),
  col<AdminProduct>({ id: "status", header: "Status" }),
  col<AdminProduct>({ id: "created_at", header: "Created" }),
  col<AdminProduct>({ id: "actions", header: "Actions", align: "right" }),
];

