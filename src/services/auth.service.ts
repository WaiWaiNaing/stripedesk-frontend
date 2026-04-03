import type { AxiosError } from "axios";
import { api } from "@/app/api/api";
import type {
  ApiErrorBody,
  ForgotRequest,
  ForgotResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserProfileResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/type/auth.type";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  const axiosError = error as AxiosError<ApiErrorBody>;

  return axiosError.response?.data?.error?.message ?? fallback;
}

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterRequest) {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);
    return data;
  },

  async forgotPassword(payload: ForgotRequest) {
    const { data } = await api.post<ForgotResponse>("/auth/forgot", payload);
    return data;
  },

  async verifyOtp(payload: VerifyOtpRequest) {
    const { data } = await api.post<VerifyOtpResponse>("/auth/verify-otp", payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordRequest) {
    const { data } = await api.post<ResetPasswordResponse>("/auth/reset-password", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<UserProfileResponse>("/auth/me");
    return data;
  },

  async resendOtp(payload: ResendOtpRequest) {
    const { data } = await api.post<ResendOtpResponse>("/auth/resend", payload);
    return data;
  },

  async refresh() {
    const { data } = await api.post<RefreshResponse>("/auth/refresh");
    return data;
  },
};
