<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { toast } from "@/lib/toast";
import { useRegisterMutation } from "@/query/auth.query";
import { getApiErrorMessage } from "@/services/auth.service";
import { Lock, MailIcon, User2 } from "@lucide/vue";

const router = useRouter();
const registerMutation = useRegisterMutation();

const form = reactive({ name: "", email: "", password: "", confirmPassword: "" });
const errors = reactive({ name: "", email: "", password: "", confirmPassword: "" });

function validate() {
  errors.name = form.name.trim() ? "" : "Full name is required";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Enter a valid email";
  errors.password = form.password.length >= 8 ? "" : "Password must be at least 8 characters";
  errors.confirmPassword = form.confirmPassword === form.password ? "" : "Passwords do not match";

  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
}

async function handleRegister() {
  if (!validate()) return;

  try {
    await registerMutation.mutateAsync({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    await router.push({
      path: "/verify-otp",
      query: {
        email: form.email.trim(),
        intent: "registration",
      },
    });
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Registration failed. Please try again."));
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" novalidate>
    <div class="mb-5">
      <FormTextInput
        v-model="form.name"
        type="text"
        label="Full name"
        placeholder="Jane Smith"
        autocomplete="name"
        :error="errors.name"
      >
        <template #icon>
          <User2 class="w-4 h-4" />
        </template>
      </FormTextInput>
    </div>

    <div class="mb-5">
      <FormTextInput
        v-model="form.email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        autocomplete="email"
        :error="errors.email"
      >
        <template #icon>
          <MailIcon class="w-4 h-4" />
        </template>
      </FormTextInput>
    </div>

    <div class="mb-5">
      <FormTextInput
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.password"
      >
        <template #icon>
          <Lock class="w-4 h-4" />
        </template>
      </FormTextInput>
    </div>

    <div class="mb-7">
      <FormTextInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      >
        <template #icon>
          <Lock class="w-4 h-4" />
        </template>
      </FormTextInput>
    </div>

    <AppButton type="submit" :loading="registerMutation.isPending.value">
      {{ registerMutation.isPending.value ? "Creating account..." : "Create account" }}
    </AppButton>
  </form>
</template>
