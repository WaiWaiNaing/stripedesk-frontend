import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/components/layout/AppShell.vue"),
      children: [
        {
          path: "",
          name: "landing",
          component: () => import("@/views/LandingView.vue"),
          meta: { public: true },
        },
        {
          path: "shop",
          name: "shop",
          component: () => import("@/views/ShopView.vue"),
          meta: { public: true },
        },
        {
          path: "cart",
          name: "cart",
          component: () => import("@/views/CartView.vue"),
        },
        {
          path: "invoices",
          name: "invoices",
          component: () => import("@/views/InvoicesView.vue"),
        },
        {
          path: "invoices/:id",
          name: "invoice-detail",
          component: () => import("@/views/InvoiceDetailView.vue"),
        },
        {
          path: "receipts",
          name: "receipts",
          component: () => import("@/views/ReceiptsView.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: () => import("@/components/layout/AdminLayout.vue"),
      meta: { requiresRole: "admin" },
      children: [
        {
          path: "",
          component: () => import("@/components/layout/AdminPagesLayout.vue"),
          children: [
            {
              path: "",
              redirect: "/admin/dashboard",
            },
            {
              path: "dashboard",
              name: "admin-dashboard",
              component: () => import("@/views/admin/AdminDashboardView.vue"),
            },
            {
              path: "users",
              name: "admin-users",
              component: () => import("@/views/admin/AdminUsersView.vue"),
            },
            {
              path: "products",
              name: "admin-products",
              component: () => import("@/views/admin/AdminProductsView.vue"),
            },
            {
              path: "currencies",
              name: "admin-currencies",
              component: () => import("@/views/admin/AdminCurrenciesView.vue"),
            },
            {
              path: "stripe-logs",
              name: "admin-stripe-logs",
              component: () => import("@/views/admin/AdminStripeLogsView.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { public: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
      meta: { public: true },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/ForgotPasswordView.vue"),
      meta: { public: true },
    },
    {
      path: "/verify-otp",
      name: "verify-otp",
      component: () => import("@/views/VerifyOtpView.vue"),
      meta: { public: true },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("@/views/ResetPasswordView.vue"),
      meta: { public: true },
    },
    {
      path: "/purchase/success",
      name: "purchase-success",
      component: () => import("@/views/PurchaseSuccessView.vue"),
      meta: { public: true },
    },
    {
      path: "/purchase/cancel",
      name: "purchase-cancel",
      component: () => import("@/views/PurchaseCancelView.vue"),
      meta: { public: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.public) {
    if (to.name === "landing" && auth.isAuthenticated && auth.role === "admin") {
      return { name: "admin" };
    }
    if (
      to.name === "shop" &&
      auth.isAuthenticated &&
      auth.role === "admin"
    ) {
      return { name: "admin" };
    }
    if (auth.isAuthenticated && (to.name === "login" || to.name === "register")) {
      return auth.role === "admin" ? { name: "admin" } : { name: "shop" };
    }

    return true;
  }

  if (!auth.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresRole === "admin" && auth.role !== "admin") {
    return { name: "shop" };
  }

  if (
    auth.role === "admin" &&
    !to.path.startsWith("/admin") &&
    to.path !== "/purchase/success" &&
    to.path !== "/purchase/cancel"
  ) {
    return { name: "admin-dashboard" };
  }

  return true;
});

export default router;
