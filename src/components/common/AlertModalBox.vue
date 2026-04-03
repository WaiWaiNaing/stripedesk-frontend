<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import AppButton from "../ui/AppButton.vue";

interface Props {
  modelValue: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  confirmVariant: "primary",
  closeOnBackdrop: true,
  closeOnEscape: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const confirmClasses = computed(() =>
  props.confirmVariant === "danger"
    ? "bg-red-500/90 hover:bg-red-500 text-white"
    : "bg-indigo-500/90 hover:bg-indigo-500 text-white",
);

function close() {
  emit("update:modelValue", false);
}

function onCancel() {
  emit("cancel");
  close();
}

function onConfirm() {
  emit("confirm");
  close();
}

function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !props.closeOnEscape) return;
  if (event.key === "Escape") close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    document.addEventListener("keydown", onKeydown);
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-100">
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        @click="closeOnBackdrop ? onCancel() : undefined"
      />

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-slate-100 shadow-2xl shadow-black/50"
          role="dialog"
          aria-modal="true"
        >
          <div class="p-5">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            <p v-if="description" class="mt-2 text-sm leading-6 text-slate-400">
              {{ description }}
            </p>

            <div class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <AppButton @click="onConfirm">
                {{ confirmText }}
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
