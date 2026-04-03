<script setup lang="ts">
interface Props {
  content: string;
}

defineProps<Props>();
</script>

<template>
  <div class="relative inline-flex group">
    <slot />

    <div
      class="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      role="tooltip"
      aria-hidden="true"
    >
      <div class="whitespace-nowrap rounded-lg border border-white/10 bg-slate-900/95 px-2 py-1 text-xs text-white shadow-xl shadow-black/40">
        {{ content }}
      </div>
    </div>
  </div>
</template>
