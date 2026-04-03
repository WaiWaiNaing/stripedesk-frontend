import { api } from "@/app/api/api";
import type {
  AdminCurrency,
  AdminProduct,
  AdminStripeLog,
  AdminUser,
  ApiIdEnvelope,
  ApiListEnvelope,
} from "@/type/admin.type";

export const adminService = {
  async listUsers(limit = 200) {
    const { data } = await api.get<ApiListEnvelope<AdminUser[]>>("/admin/users", {
      params: { limit },
    });
    return data.data;
  },

  async createAdminUser(body: { name: string; email: string; password: string }) {
    const { data } = await api.post<ApiIdEnvelope>("/admin/users", body);
    return data;
  },

  async deleteUser(id: number) {
    const { data } = await api.delete<ApiIdEnvelope>(`/admin/users/${id}`);
    return data;
  },

  async listProducts(includeDeleted = false) {
    const params = includeDeleted ? { include_deleted: true } : undefined;
    const { data } = await api.get<ApiListEnvelope<AdminProduct[]>>("/admin/products", {
      params,
    });
    return data.data;
  },

  async createProduct(body: {
    name: string;
    description: string | null;
    price: number | string;
    currency_code: string;
  }) {
    const { data } = await api.post<ApiIdEnvelope>("/admin/products", body);
    return data;
  },

  async updateProduct(
    id: number,
    body: {
      name: string;
      description: string | null;
      price: number | string;
      currency_code: string;
    },
  ) {
    const { data } = await api.put<ApiIdEnvelope>(`/admin/products/${id}`, body);
    return data;
  },

  async listCurrencies() {
    const { data } = await api.get<ApiListEnvelope<AdminCurrency[]>>("/admin/currencies");
    return data.data;
  },

  async createCurrency(body: {
    code: string;
    numeric_code: string | null;
    name: string;
    minor_unit: number;
    symbol: string | null;
    is_default: boolean;
  }) {
    const { data } = await api.post<ApiIdEnvelope>("/admin/currencies", body);
    return data;
  },

  async updateCurrency(
    id: number,
    body: {
      name: string;
      numeric_code: string | null;
      minor_unit: number;
      symbol: string | null;
      is_default: boolean;
    },
  ) {
    const { data } = await api.put<ApiIdEnvelope>(`/admin/currencies/${id}`, body);
    return data;
  },

  async listStripeLogs(limit = 100) {
    const { data } = await api.get<ApiListEnvelope<AdminStripeLog[]>>("/admin/stripe-logs", {
      params: { limit },
    });
    return data.data;
  },
};
