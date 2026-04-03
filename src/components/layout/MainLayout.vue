<script setup lang="ts">
import MainNavbar from "@/components/core/MainNavbar.vue";
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_40%)]"
    />

    <MainNavbar />

    <main class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <slot />
    </main>
  </div>
</template>
