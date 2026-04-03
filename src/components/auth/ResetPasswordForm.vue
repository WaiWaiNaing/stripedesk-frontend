<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { toast } from "@/lib/toast";
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

function validate() {
  errors.password = form.password.length >= 8 ? "" : "Password must be at least 8 characters";
  errors.confirmPassword =
    form.confirmPassword === form.password ? "" : "Passwords do not match";

  if (!props.email || !props.token) {
    toast.error("Reset link is incomplete. Please restart the recovery flow.");
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

    toast.success("Password updated. You can sign in again.");
    await router.push({
      path: "/login",
      query: { reset: "1" },
    });
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Failed to reset password. Please try again."));
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
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
