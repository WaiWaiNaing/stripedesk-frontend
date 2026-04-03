import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { authService } from "@/services/auth.service";
import type {
  ForgotRequest,
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "@/type/auth.type";

export const authQueryKeys = {
  all: ["auth"] as const,
  me: () => [...authQueryKeys.all, "me"] as const,
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotRequest) => authService.forgotPassword(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload),
  });
}

export function useMeQuery(enabled: MaybeRefOrGetter<boolean> = true) {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: () => authService.me(),
    enabled: computed(() => toValue(enabled)),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (payload: ResendOtpRequest) => authService.resendOtp(payload),
  });
}
