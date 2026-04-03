<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FormPinInput from "@/components/common/form-input/FormPinInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/query/auth.query";
import { getApiErrorMessage } from "@/services/auth.service";
import type { AuthIntent, VerifyOtpResponse } from "@/type/auth.type";

interface Props {
  email?: string;
  intent?: AuthIntent;
}

const props = withDefaults(defineProps<Props>(), {
  email: "",
  intent: "registration",
});

const router = useRouter();
const verifyOtpMutation = useVerifyOtpMutation();
const resendOtpMutation = useResendOtpMutation();
const form = reactive({ code: "" });
const fieldError = ref("");
const submitError = ref("");
const resendMessage = ref("");
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const isResendDisabled = computed(
  () => resendOtpMutation.isPending.value || resendCooldown.value > 0,
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
  submitError.value = "";
  resendMessage.value = "";

  if (!form.code || form.code.length !== 6) {
    fieldError.value = "Enter the 6-digit verification code.";
    return;
  }

  if (!props.email) {
    submitError.value = "Missing email for OTP verification.";
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

    await router.push({
      path: "/",
      query: { verified: "1" },
    });
  } catch (error) {
    submitError.value = getApiErrorMessage(error, "OTP verification failed. Please try again.");
  }
}

async function handleResendOtp() {
  submitError.value = "";
  resendMessage.value = "";

  if (!props.email) {
    submitError.value = "Missing email for OTP resend.";
    return;
  }

  try {
    await resendOtpMutation.mutateAsync({
      email: props.email,
      intent: props.intent,
    });

    form.code = "";
    fieldError.value = "";
    resendMessage.value = "A new OTP has been sent to your email.";
    startResendTimer();
  } catch (error) {
    submitError.value = getApiErrorMessage(error, "Failed to resend OTP. Please try again.");
  }
}

onBeforeUnmount(() => {
  stopResendTimer();
});
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div
      v-if="submitError"
      class="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span class="flex-1">{{ submitError }}</span>
    </div>

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

  <p v-if="resendMessage" class="mt-3 text-center text-sm text-emerald-400">
    {{ resendMessage }}
  </p>
</template>
