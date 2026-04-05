<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormPinInput from "@/components/common/form-input/FormPinInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { toast } from "@/lib/toast";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/query/auth.query";
import { authService, getApiErrorMessage } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth";
import type { AuthIntent, VerifyOtpResponse } from "@/type/auth.type";

interface Props {
  email?: string;
  intent?: AuthIntent;
}

const props = withDefaults(defineProps<Props>(), {
  email: "",
  intent: "registration",
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const verifyOtpMutation = useVerifyOtpMutation();
const resendOtpMutation = useResendOtpMutation();
const form = reactive({ code: "" });
const fieldError = ref("");
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const isResendDisabled = computed(
  () => resendOtpMutation.isPending.value || resendCooldown.value > 0,
);

const destination = computed(() =>
  typeof route.query.redirect === "string"
    ? route.query.redirect
    : auth.role === "admin"
      ? "/admin"
      : "/shop",
);

function stopResendTimer() {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
}

function startResendTimer(seconds = 60) {
  stopResendTimer();
  resendCooldown.value = seconds;

  resendTimer = setInterval(() => {
    if (resendCooldown.value <= 1) {
      resendCooldown.value = 0;
      stopResendTimer();
      return;
    }

    resendCooldown.value -= 1;
  }, 1000);
}

function maskEmail(value: string) {
  return value
    .split("")
    .map((char, index) => (index > 1 && index < value.length - 9 ? "*" : char))
    .join("");
}

function isResetResponse(
  response: VerifyOtpResponse,
): response is Extract<VerifyOtpResponse, { data: { reset_token: string } }> {
  return "reset_token" in response.data;
}

async function handleSubmit() {
  fieldError.value = "";

  if (!form.code || form.code.length !== 6) {
    fieldError.value = "Enter the 6-digit verification code.";
    return;
  }

  if (!props.email) {
    toast.error("Missing email for OTP verification.");
    return;
  }

  try {
    const response = await verifyOtpMutation.mutateAsync({
      email: props.email,
      otp: form.code,
      intent: props.intent,
    });

    if (isResetResponse(response)) {
      await router.push({
        path: "/reset-password",
        query: {
          email: props.email,
          token: response.data.reset_token,
        },
      });
      return;
    }

    try {
      const profileResponse = await authService.me();
      auth.setSession({
        id: profileResponse.data.id,
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        role: profileResponse.data.role,
      });
    } catch {
      toast.error("Verified, but failed to load your profile.");
      return;
    }

    await router.push(destination.value);
  } catch (error) {
    toast.error(getApiErrorMessage(error, "OTP verification failed. Please try again."));
  }
}

async function handleResendOtp() {
  if (!props.email) {
    toast.error("Missing email for OTP resend.");
    return;
  }

  try {
    await resendOtpMutation.mutateAsync({
      email: props.email,
      intent: props.intent,
    });

    form.code = "";
    fieldError.value = "";
    toast.success("A new code has been sent to your email.");
    startResendTimer();
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Failed to resend OTP. Please try again."));
  }
}

onBeforeUnmount(() => {
  stopResendTimer();
});
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <FormPinInput v-model="form.code" label="Verification code" :error="fieldError" />

    <p v-if="props.email" class="text-center text-sm text-slate-400">
      Code sent to <span class="font-medium text-slate-200">{{ maskEmail(props.email) }}</span>
    </p>

    <AppButton type="submit" :loading="verifyOtpMutation.isPending.value">
      {{ verifyOtpMutation.isPending.value ? "Verifying code..." : "Verify code" }}
    </AppButton>
  </form>

  <p class="mt-6 text-center text-sm text-slate-500">
    Need a new code?
    <button
      type="button"
      class="font-medium text-indigo-400 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
      :disabled="isResendDisabled"
      @click="handleResendOtp"
    >
      {{
        resendOtpMutation.isPending.value
          ? "Resending..."
          : resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Resend OTP"
      }}
    </button>
  </p>
</template>
