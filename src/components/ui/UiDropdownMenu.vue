<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  align?: "left" | "right";
}

withDefaults(defineProps<Props>(), {
  align: "right",
});

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onDocumentPointerDown(event: PointerEvent) {
  const el = root.value;
  if (!el || !open.value) return;
  if (event.target instanceof Node && !el.contains(event.target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
});
</script>

<template>
  <div ref="root" class="relative">
    <div @click.stop="toggle">
      <slot name="trigger" :open="open" :toggle="toggle" :close="close" />
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="open"
        class="absolute z-50 mt-2 min-w-48 rounded-xl border border-white/10 bg-slate-900/95 py-1 shadow-xl shadow-black/40 backdrop-blur-xl"
        :class="align === 'right' ? 'right-0' : 'left-0'"
        role="menu"
        @click.stop
      >
        <slot name="default" :close="close" />
      </div>
    </Transition>
  </div>
</template>
