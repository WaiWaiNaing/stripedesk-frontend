<script setup lang="ts">
import AuthLayout from "@/components/auth/AuthLayout.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
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
        Built for speed.<br />
        <span class="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          Payments made simple.
        </span>
      </h2>
      <p class="text-base text-white/60 leading-relaxed mb-9">
        Manage products, subscriptions, and invoices<br />in one elegant dashboard.
      </p>

      <div class="flex flex-wrap justify-center gap-2.5">
        <div
          class="inline-flex items-center gap-2 bg-white/8 border border-white/14 backdrop-blur-md rounded-full px-4 py-[7px] text-[13px] font-medium text-white/85"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0"
          />
          Stripe Checkout
        </div>
        <div
          class="inline-flex items-center gap-2 bg-white/8 border border-white/14 backdrop-blur-md rounded-full px-4 py-[7px] text-[13px] font-medium text-white/85"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] shrink-0"
          />
          JWT Auth
        </div>
        <div
          class="inline-flex items-center gap-2 bg-white/8 border border-white/14 backdrop-blur-md rounded-full px-4 py-[7px] text-[13px] font-medium text-white/85"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] shrink-0"
          />
          Role-based
        </div>
      </div>
    </template>

    <!-- Brand stats -->
    <template #brand-stats>
      <div class="flex flex-col items-center px-8">
        <span class="text-[20px] font-bold text-white tracking-[-0.5px] leading-none mb-1">
          99.9%
        </span>
        <span class="text-[11px] font-medium tracking-[0.5px] text-white/45 uppercase">
          Uptime
        </span>
      </div>
      <div class="w-px h-8 bg-white/15" />
      <div class="flex flex-col items-center px-8">
        <span class="text-[20px] font-bold text-white tracking-[-0.5px] leading-none mb-1">
          256-bit
        </span>
        <span class="text-[11px] font-medium tracking-[0.5px] text-white/45 uppercase">
          Encryption
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

    <AuthFormHeader title="Welcome back" subtitle="Sign in to your account" />

    <LoginForm />

    <AuthSwitchLink prompt="Don't have an account?" to="/register" link-label="Create one" />

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
