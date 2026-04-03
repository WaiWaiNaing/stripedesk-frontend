<script setup lang="ts">
import AuthLayout from "@/components/auth/AuthLayout.vue";
import SignUpForm from "@/components/auth/SignUpForm.vue";
import AuthFormHeader from "@/components/ui/AuthFormHeader.vue";
import AuthSwitchLink from "@/components/ui/AuthSwitchLink.vue";
</script>

<template>
  <AuthLayout>
    <!-- Brand hero content -->
    <template #brand-hero>
      <div
        class="inline-block text-[11px] font-semibold tracking-[2px] uppercase text-white/50 bg-white/8 border border-white/12 rounded-full px-3.5 py-1 mb-7"
      >
        Commerce Platform
      </div>
      <h2 class="text-[44px] font-extrabold text-white leading-[1.12] tracking-[-1.5px] mb-[18px]">
        Get started<br />
        <span class="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          in seconds.
        </span>
      </h2>
      <p class="text-base text-white/60 leading-relaxed mb-9">
        Create your account and start managing<br />payments with ease.
      </p>

      <!-- Steps -->
      <div class="flex flex-col gap-3 text-left">
        <div
          class="flex items-center gap-3 bg-white/6 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3"
        >
          <div
            class="w-7 h-7 rounded-full bg-[#6c47ff] flex items-center justify-center text-white text-[12px] font-bold shrink-0"
          >
            1
          </div>
          <span class="text-[13px] text-white/75">Create your account</span>
        </div>
        <div
          class="flex items-center gap-3 bg-white/6 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3"
        >
          <div
            class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-[12px] font-bold shrink-0"
          >
            2
          </div>
          <span class="text-[13px] text-white/45">Connect your Stripe account</span>
        </div>
        <div
          class="flex items-center gap-3 bg-white/6 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3"
        >
          <div
            class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-[12px] font-bold shrink-0"
          >
            3
          </div>
          <span class="text-[13px] text-white/45">Manage everything from your dashboard</span>
        </div>
      </div>
    </template>

    <!-- Brand stats -->
    <template #brand-stats>
      <div class="flex flex-col items-center px-8">
        <span class="text-[20px] font-bold text-white tracking-[-0.5px] leading-none mb-1">
          Free
        </span>
        <span class="text-[11px] font-medium tracking-[0.5px] text-white/45 uppercase">
          To start
        </span>
      </div>
      <div class="w-px h-8 bg-white/15" />
      <div class="flex flex-col items-center px-8">
        <span class="text-[20px] font-bold text-white tracking-[-0.5px] leading-none mb-1">
          2 min
        </span>
        <span class="text-[11px] font-medium tracking-[0.5px] text-white/45 uppercase">
          Setup
        </span>
      </div>
      <div class="w-px h-8 bg-white/15" />
      <div class="flex flex-col items-center px-8">
        <span class="text-[20px] font-bold text-white tracking-[-0.5px] leading-none mb-1">
          PCI
        </span>
        <span class="text-[11px] font-medium tracking-[0.5px] text-white/45 uppercase">
          Compliant
        </span>
      </div>
    </template>

    <AuthFormHeader title="Create an account" subtitle="Start managing payments today" compact />

    <SignUpForm />

    <AuthSwitchLink prompt="Already have an account?" to="/login" link-label="Sign in" />

    <p class="mt-7 text-center text-[13px] text-[#4a4a6a]">
      Secure access powered by
      <a
        href="https://stripe.com"
        target="_blank"
        rel="noopener"
        class="text-[#6c47ff] hover:underline"
      >
        Stripe
      </a>
      &amp; JWT
    </p>
  </AuthLayout>
</template>
