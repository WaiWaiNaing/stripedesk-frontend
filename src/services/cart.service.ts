import axios from "axios";
import { api } from "@/app/api/api";
import type {
  CartAddItemRequest,
  CartDetailResponse,
  CartLineQuantityRequest,
  CheckoutInvoiceRequest,
  InvoiceApiResponse,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
} from "@/type/cart.type";

export const cartService = {
  /** Returns `null` when the user has no active cart (API 404). */
  async getActiveCartForUser(userId: number): Promise<CartDetailResponse | null> {
    try {
      const { data } = await api.get<CartDetailResponse>(`/users/${userId}/cart`);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  async addItemToUserCart(userId: number, body: CartAddItemRequest) {
    const { data } = await api.post<CartDetailResponse>(`/users/${userId}/cart/items`, body);
    return data;
  },

  async updateCartLineQuantity(cartId: number, productId: number, body: CartLineQuantityRequest) {
    const { data } = await api.patch<CartDetailResponse>(
      `/carts/${cartId}/items/${productId}`,
      body,
    );
    return data;
  },

  async removeCartLine(cartId: number, productId: number) {
    const { data } = await api.delete<CartDetailResponse>(`/carts/${cartId}/items/${productId}`);
    return data;
  },

  async createCheckoutSession(body: CheckoutSessionRequest) {
    const { data } = await api.post<CheckoutSessionResponse>("/checkout/session", body);
    return data;
  },

  async createInvoiceFromCart(body: CheckoutInvoiceRequest) {
    const { data } = await api.post<InvoiceApiResponse>("/checkout/invoice", body);
    return data;
  },

  async payInvoice(invoiceId: number) {
    const { data } = await api.post<InvoiceApiResponse>(`/invoices/${invoiceId}/pay`);
    return data;
  },
};
