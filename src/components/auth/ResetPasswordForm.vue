<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useResetPasswordMutation } from "@/query/auth.query";
import { getApiErrorMessage } from "@/services/auth.service";

interface Props {
  email?: string;
  token?: string;
}

const props = withDefaults(defineProps<Props>(), {
  email: "",
  token: "",
});

const router = useRouter();
const resetPasswordMutation = useResetPasswordMutation();

const form = reactive({ password: "", confirmPassword: "" });
const errors = reactive({ password: "", confirmPassword: "" });
const submitError = ref("");

function validate() {
  submitError.value = "";
  errors.password = form.password.length >= 8 ? "" : "Password must be at least 8 characters";
  errors.confirmPassword =
    form.confirmPassword === form.password ? "" : "Passwords do not match";

  if (!props.email || !props.token) {
    submitError.value = "Reset link is incomplete. Please restart the recovery flow.";
    return false;
  }

  return !errors.password && !errors.confirmPassword;
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    await resetPasswordMutation.mutateAsync({
      email: props.email,
      reset_token: props.token,
      new_password: form.password,
    });

    await router.push({
      path: "/login",
      query: { reset: "1" },
    });
  } catch (error) {
    submitError.value = getApiErrorMessage(error, "Failed to reset password. Please try again.");
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
      v-model="form.password"
      type="password"
      label="New password"
      placeholder="••••••••"
      autocomplete="new-password"
      :error="errors.password"
    />

    <FormTextInput
      v-model="form.confirmPassword"
      type="password"
      label="Confirm password"
      placeholder="••••••••"
      autocomplete="new-password"
      :error="errors.confirmPassword"
    />

    <AppButton type="submit" :loading="resetPasswordMutation.isPending.value">
      {{ resetPasswordMutation.isPending.value ? "Resetting password..." : "Reset password" }}
    </AppButton>
  </form>
</template>
