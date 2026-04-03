<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { toast } from "@/lib/toast";
import { useForgotPasswordMutation } from "@/query/auth.query";
import { getApiErrorMessage } from "@/services/auth.service";

const router = useRouter();
const forgotPasswordMutation = useForgotPasswordMutation();

const form = reactive({ email: "" });
const fieldError = ref("");

function validate() {
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
    toast.error(
      getApiErrorMessage(error, "Failed to send recovery code. Please try again."),
    );
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
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
