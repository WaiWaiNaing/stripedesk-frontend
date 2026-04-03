import { col, type ColumnDef } from "@/components/ui/table";
import type { AdminStripeLog } from "@/type/admin.type";

export const adminStripeLogsColumns: Array<ColumnDef<AdminStripeLog>> = [
  col<AdminStripeLog>({ id: "id", header: "ID" }),
  col<AdminStripeLog>({ id: "event_type", header: "Event type" }),
  col<AdminStripeLog>({ id: "created_at", header: "Created" }),
  col<AdminStripeLog>({ id: "actions", header: "Actions", align: "right" }),
];

