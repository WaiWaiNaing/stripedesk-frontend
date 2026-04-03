<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  compact: false,
});
</script>

<template>
  <div :class="compact ? 'mb-8' : 'mb-9'">
    <h1 class="text-[30px] font-bold text-[#f0f0ff] tracking-[-0.5px] mb-1.5">
      {{ title }}
    </h1>
    <p class="text-[15px] text-[#6b6b8a]">{{ subtitle }}</p>
  </div>
</template>
