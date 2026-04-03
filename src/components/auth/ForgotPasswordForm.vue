<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useForgotPasswordMutation } from "@/query/auth.query";
import { getApiErrorMessage } from "@/services/auth.service";

const router = useRouter();
const forgotPasswordMutation = useForgotPasswordMutation();

const form = reactive({ email: "" });
const fieldError = ref("");
const submitError = ref("");

function validate() {
  submitError.value = "";
  fieldError.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Enter a valid email";
  return !fieldError.value;
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    await forgotPasswordMutation.mutateAsync({
      email: form.email.trim(),
    });

    await router.push({
      path: "/verify-otp",
      query: {
        email: form.email.trim(),
        intent: "reset_password",
      },
    });
  } catch (error) {
    submitError.value = getApiErrorMessage(
      error,
      "Failed to send recovery code. Please try again.",
    );
  }
}
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

    <FormTextInput
      v-model="form.email"
      type="email"
      label="Email address"
      placeholder="you@example.com"
      autocomplete="email"
      :error="fieldError"
    />

    <AppButton type="submit" :loading="forgotPasswordMutation.isPending.value">
      {{ forgotPasswordMutation.isPending.value ? "Sending code..." : "Send recovery link" }}
    </AppButton>
  </form>
</template>
