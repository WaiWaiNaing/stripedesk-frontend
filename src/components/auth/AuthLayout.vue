<script setup lang="ts"></script>

<template>
  <div class="flex min-h-screen bg-[#0a0a0f]">
    <!-- Left panel — brand -->
    <div
      class="relative hidden md:flex flex-1 flex-col items-center justify-center overflow-hidden px-14 py-10"
      style="background: linear-gradient(160deg, #3d1de0 0%, #2510a8 45%, #110866 100%)"
    >
      <!-- Decorative orbs -->
      <div
        class="absolute rounded-full pointer-events-none blur-[72px] w-[420px] h-[420px] bg-violet-500/45 -top-[120px] -right-[80px]"
      />
      <div
        class="absolute rounded-full pointer-events-none blur-[72px] w-[320px] h-[320px] bg-blue-500/25 -bottom-[60px] -left-[60px]"
      />
      <div
        class="absolute rounded-full pointer-events-none blur-[72px] w-[200px] h-[200px] bg-pink-500/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <!-- Dot grid -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />

      <!-- Logo — top-left -->
      <div class="absolute top-9 left-12 flex items-center gap-2.5 z-10">
        <div
          class="w-9 h-9 rounded-[9px] bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm"
        >
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 4a8 8 0 0 1 7.938 6.938C26.097 17.367 23.212 16 20 16s-6.097 1.367-7.938 2.938A8 8 0 0 1 20 12zm0 16a8 8 0 0 1-7.938-6.938C13.903 22.633 16.788 24 20 24s6.097-1.367 7.938-2.938A8 8 0 0 1 20 28z"
              fill="white"
            />
          </svg>
        </div>
        <span class="text-[18px] font-bold text-white tracking-tight">StripeDesk</span>
      </div>

      <!-- Hero content -->
      <div class="relative z-10 text-center max-w-[420px]">
        <slot name="brand-hero" />
      </div>

      <!-- Stats bar — pinned bottom -->
      <div class="absolute bottom-9 inset-x-0 flex items-center justify-center z-10">
        <slot name="brand-stats" />
      </div>
    </div>

    <!-- Right panel — form -->
    <div
      class="w-full md:w-[480px] shrink-0 flex items-center justify-center px-6 py-12 md:px-10 bg-[#0f0f18]"
    >
      <div class="w-full max-w-[380px]">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2.5 mb-8 md:hidden">
          <div class="w-8 h-8 rounded-[8px] bg-[#6c47ff] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 4a8 8 0 0 1 7.938 6.938C26.097 17.367 23.212 16 20 16s-6.097 1.367-7.938 2.938A8 8 0 0 1 20 12zm0 16a8 8 0 0 1-7.938-6.938C13.903 22.633 16.788 24 20 24s6.097-1.367 7.938-2.938A8 8 0 0 1 20 28z"
                fill="white"
              />
            </svg>
          </div>
          <span class="text-[18px] font-bold text-white tracking-tight">StripeDesk</span>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>
