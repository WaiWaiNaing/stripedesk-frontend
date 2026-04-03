<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Lock, MailIcon, Info } from "@lucide/vue";
import FormTextInput from "@/components/common/form-input/FormTextInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useLoginMutation, useResendOtpMutation } from "@/query/auth.query";
import { authService, getApiErrorMessage } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loginMutation = useLoginMutation();
const resendOtpMutation = useResendOtpMutation();
const form = reactive({ email: "", password: "" });
const errors = reactive({ email: "", password: "" });
const submitError = ref("");

const destination = computed(() =>
  typeof route.query.redirect === "string"
    ? route.query.redirect
    : auth.role === "admin"
      ? "/admin"
      : "/dashboard",
);

function validate() {
  submitError.value = "";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Enter a valid email";
  errors.password = form.password ? "" : "Password is required";
  return !errors.email && !errors.password;
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    const loginResponse = await loginMutation.mutateAsync({
      email: form.email.trim(),
      password: form.password,
    });

    if (loginResponse.data.requires_verification) {
      await resendOtpMutation.mutateAsync({
        email: form.email.trim(),
        intent: "registration",
      });
      await router.push({
        path: "/verify-otp",
        query: {
          email: form.email.trim(),
          intent: "registration",
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
      submitError.value = "Logged in, but failed to load your profile.";
      return;
    }

    await router.push(destination.value);
  } catch (error) {
    submitError.value = getApiErrorMessage(error, "Login failed. Please try again.");
  }
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <div
      v-if="submitError"
      class="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
    >
      <Info class="h-4 w-4 shrink-0" />
      <span class="flex-1">{{ submitError }}</span>
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
          <MailIcon class="h-4 w-4" />
        </template>
      </FormTextInput>
    </div>

    <div class="mb-7">
      <FormTextInput
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autocomplete="current-password"
        :error="errors.password"
      >
        <template #icon>
          <Lock class="h-4 w-4" />
        </template>
      </FormTextInput>

      <div class="mt-3 text-right">
        <router-link
          to="/forgot-password"
          class="text-sm font-medium text-[#8b72ff] hover:underline"
        >
          Forgot password?
        </router-link>
      </div>
    </div>

    <AppButton
      type="submit"
      :loading="loginMutation.isPending.value || resendOtpMutation.isPending.value"
    >
      {{
        loginMutation.isPending.value || resendOtpMutation.isPending.value
          ? "Signing in..."
          : "Sign in"
      }}
    </AppButton>
  </form>
</template>
