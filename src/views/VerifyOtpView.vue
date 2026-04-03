<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AuthLayout from "@/components/auth/AuthLayout.vue";
import VerifyOTPForm from "@/components/auth/VerifyOTPForm.vue";
import AuthFormHeader from "@/components/ui/AuthFormHeader.vue";
import type { AuthIntent } from "@/type/auth.type";

const route = useRoute();

const email = computed(() => {
  const value = route.query.email;
  return typeof value === "string" ? value : "";
});

const intent = computed<AuthIntent>(() => {
  const value = route.query.intent;

  if (value === "reset_password" || value === "password_reset") {
    return "reset_password";
  }

  return "registration";
});
</script>

<template>
  <AuthLayout>
    <template #brand-hero>
      <div
        class="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/75"
      >
        Verification
      </div>
      <h2 class="mt-6 text-[42px] font-extrabold leading-[1.08] tracking-[-1.5px] text-white">
        Confirm your access<br />
        <span class="bg-linear-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
          with a one-time code.
        </span>
      </h2>
      <p class="mt-5 text-base leading-7 text-white/65">
        Registration and recovery can both land here once the backend OTP flow is wired up.
      </p>
    </template>

    <template #brand-stats>
      <div class="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
        6-digit secure verification
      </div>
    </template>

    <AuthFormHeader title="Verify OTP" subtitle="Enter the code sent to your email." compact />

    <VerifyOTPForm :email="email" :intent="intent" />
  </AuthLayout>
</template>
