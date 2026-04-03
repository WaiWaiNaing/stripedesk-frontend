<script setup lang="ts">
import { computed } from "vue";
import type { TableAlign } from "@/components/ui/table";

const props = withDefaults(
  defineProps<{
    as?: "td" | "th";
    align?: TableAlign;
    mono?: boolean;
    class?: string;
  }>(),
  {
    as: "td",
    align: "left",
    mono: false,
  },
);

const alignClass = computed(() => {
  if (props.align === "right") return "text-right";
  if (props.align === "center") return "text-center";
  return "text-left";
});
</script>

<template>
  <component
    :is="as"
    :class="[
      'px-4 py-3 align-middle',
      alignClass,
      mono ? 'font-mono' : '',
      $attrs.class,
    ]"
  >
    <slot />
  </component>
</template>

