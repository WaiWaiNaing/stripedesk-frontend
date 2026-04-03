<script setup lang="ts">
interface Props {
  prompt: string;
  to: string;
  linkLabel: string;
}

defineProps<Props>();
</script>

<template>
  <p class="mt-6 text-center text-sm text-[#6b6b8a]">
    {{ prompt }}
    <router-link :to="to" class="text-[#6c47ff] hover:underline font-medium">
      {{ linkLabel }}
    </router-link>
  </p>
</template>
