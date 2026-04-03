import { computed, ref } from "vue";
import { defineStore } from "pinia";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

const USER_KEY = "user";
const TOKEN_KEY = "token";

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(readStoredUser());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const token = ref<string | null>(null);
  const isAuthenticated = computed(() => Boolean(user.value));
  const role = computed<UserRole>(() => user.value?.role ?? "user");

  function setSession(nextUser: AuthUser) {
    user.value = nextUser;
    error.value = null;
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string | { message?: string } }
        | null;

      if (!response.ok) {
        error.value =
          (data as { error?: string | { message?: string } } | null)?.error instanceof Object
            ? (data as { error?: { message?: string } }).error?.message ?? "Login failed"
            : (data as { error?: string } | null)?.error ?? "Login failed";
        return false;
      }

      return true;
    } catch {
      error.value = "Network error. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    error.value = null;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  function clearError() {
    error.value = null;
  }

  return {
    clearError,
    error,
    isAuthenticated,
    loading,
    login,
    logout,
    role,
    setSession,
    token,
    user,
  };
});
