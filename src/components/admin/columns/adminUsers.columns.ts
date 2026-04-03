import { col, type ColumnDef } from "@/components/ui/table";
import type { AdminUser } from "@/type/admin.type";

export const adminUsersColumns: Array<ColumnDef<AdminUser>> = [
  col<AdminUser>({ id: "id", header: "ID", align: "left" }),
  col<AdminUser>({ id: "name", header: "Name" }),
  col<AdminUser>({ id: "email", header: "Email" }),
  col<AdminUser>({ id: "role", header: "Role" }),
  col<AdminUser>({ id: "created_at", header: "Created" }),
  col<AdminUser>({ id: "actions", header: "Actions", align: "right" }),
];

