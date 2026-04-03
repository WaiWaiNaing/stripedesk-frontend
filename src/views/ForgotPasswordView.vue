<script setup lang="ts">
import AuthLayout from "@/components/auth/AuthLayout.vue";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.vue";
import AuthFormHeader from "@/components/ui/AuthFormHeader.vue";
</script>

<template>
  <AuthLayout>
    <template #brand-hero>
      <div class="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/75">
        Account recovery
      </div>
      <h2 class="mt-6 text-[42px] font-extrabold leading-[1.08] tracking-[-1.5px] text-white">
        Recover access<br />
        <span class="bg-linear-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
          without friction.
        </span>
      </h2>
      <p class="mt-5 text-base leading-7 text-white/65">
        Keep the source app's recovery path while fitting it into the new StripeDesk visual system.
      </p>
    </template>

    <template #brand-stats>
      <div class="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
        Reset link and OTP flow ready
      </div>
    </template>

    <AuthFormHeader
      title="Forgot your password?"
      subtitle="Enter your email to continue to the recovery flow."
      compact
    />

    <ForgotPasswordForm />

    <p class="mt-6 text-center text-sm text-slate-500">
      Return to
      <router-link to="/login" class="font-medium text-indigo-400 hover:underline">sign in</router-link>
    </p>
  </AuthLayout>
</template>
