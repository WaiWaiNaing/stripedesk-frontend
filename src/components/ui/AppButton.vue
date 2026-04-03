<script setup lang="ts">
interface Props {
  class?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  class: "",
  type: "button",
  disabled: false,
  loading: false,
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="flex items-center justify-center w-full h-12 rounded-[10px] text-[15px] font-semibold text-white border-0 cursor-pointer bg-linear-to-br from-[#6c47ff] to-[#4f2de0] shadow-[0_4px_20px_rgba(108,71,255,0.45)] transition-[opacity,box-shadow] duration-200 not-disabled:hover:opacity-90 not-disabled:hover:shadow-[0_6px_28px_rgba(108,71,255,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
    :class="class"
  >
    <svg
      v-if="loading"
      class="animate-spin mr-2 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <slot />
  </button>
</template>
