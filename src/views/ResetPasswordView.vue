<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AuthLayout from "@/components/auth/AuthLayout.vue";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm.vue";
import AuthFormHeader from "@/components/ui/AuthFormHeader.vue";

const route = useRoute();

const email = computed(() => {
  const value = route.query.email;
  return typeof value === "string" ? value : "";
});

const token = computed(() => {
  const value = route.query.token;
  return typeof value === "string" ? value : "";
});
</script>

<template>
  <AuthLayout>
    <template #brand-hero>
      <div class="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/75">
        Password reset
      </div>
      <h2 class="mt-6 text-[42px] font-extrabold leading-[1.08] tracking-[-1.5px] text-white">
        Set a stronger<br />
        <span class="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
          StripeDesk password.
        </span>
      </h2>
      <p class="mt-5 text-base leading-7 text-white/65">
        A dedicated reset screen keeps parity with the source app's public auth journey.
      </p>
    </template>

    <template #brand-stats>
      <div class="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
        Password policy placeholder
      </div>
    </template>

    <AuthFormHeader title="Create a new password" subtitle="Use at least 8 characters." compact />

    <ResetPasswordForm :email="email" :token="token" />
  </AuthLayout>
</template>
