<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

interface Props {
  modelValue: string;
  length?: number;
  label?: string;
  error?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  label: "",
  error: "",
  autocomplete: "one-time-code",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputRefs = ref<HTMLInputElement[]>([]);

const digits = computed(() => {
  const normalized = props.modelValue.replace(/\D/g, "").slice(0, props.length);
  return Array.from({ length: props.length }, (_, index) => normalized[index] ?? "");
});

const hasError = computed(() => !!props.error);

function setInputRef(el: HTMLInputElement | null, index: number) {
  if (el) inputRefs.value[index] = el;
}

function updateDigits(nextDigits: string[]) {
  emit("update:modelValue", nextDigits.join(""));
}

async function focusIndex(index: number) {
  await nextTick();
  inputRefs.value[index]?.focus();
  inputRefs.value[index]?.select();
}

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, "");
  const nextDigits = [...digits.value];

  if (!value) {
    nextDigits[index] = "";
    updateDigits(nextDigits);
    return;
  }

  if (value.length > 1) {
    applyPastedValue(value, index);
    return;
  }

  nextDigits[index] = value;
  updateDigits(nextDigits);

  if (index < props.length - 1) {
    void focusIndex(index + 1);
  }
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const nextDigits = [...digits.value];

  if (event.key === "Backspace") {
    if (nextDigits[index]) {
      nextDigits[index] = "";
      updateDigits(nextDigits);
      return;
    }

    if (index > 0) {
      nextDigits[index - 1] = "";
      updateDigits(nextDigits);
      void focusIndex(index - 1);
    }
    return;
  }

  if (event.key === "ArrowLeft" && index > 0) {
    event.preventDefault();
    void focusIndex(index - 1);
    return;
  }

  if (event.key === "ArrowRight" && index < props.length - 1) {
    event.preventDefault();
    void focusIndex(index + 1);
  }
}

function applyPastedValue(value: string, startIndex = 0) {
  const sanitized = value.replace(/\D/g, "").slice(0, props.length);
  if (!sanitized) return;

  const nextDigits = [...digits.value];

  for (const [offset, char] of Array.from(sanitized).entries()) {
    const targetIndex = startIndex + offset;
    if (targetIndex >= props.length) break;
    nextDigits[targetIndex] = char;
  }

  updateDigits(nextDigits);

  const nextFocusIndex = Math.min(startIndex + sanitized.length, props.length - 1);
  void focusIndex(nextFocusIndex);
}

function handlePaste(event: ClipboardEvent, index: number) {
  event.preventDefault();
  applyPastedValue(event.clipboardData?.getData("text") ?? "", index);
}

watch(
  () => props.modelValue,
  (value) => {
    const normalized = value.replace(/\D/g, "").slice(0, props.length);
    if (normalized !== value) emit("update:modelValue", normalized);
  },
);
</script>

<template>
  <div>
    <label
      v-if="label"
      class="mb-1.5 block text-[13px] font-medium tracking-[0.2px] text-[#a0a0c0]"
    >
      {{ label }}
    </label>

    <div class="flex items-center justify-between gap-2 sm:gap-3">
      <input
        v-for="(_, index) in digits"
        :key="index"
        :ref="(el) => setInputRef(el as HTMLInputElement | null, index)"
        :value="digits[index]"
        :autocomplete="index === 0 ? autocomplete : 'off'"
        inputmode="numeric"
        maxlength="1"
        type="text"
        class="h-12 w-11 rounded-[10px] border bg-[#1a1a2e] text-center text-lg font-semibold text-[#e0e0f0] outline-none transition-[border-color,box-shadow] duration-200 sm:h-14 sm:w-12 hover:border-[#6c47ff] focus:border-[#6c47ff]"
        :class="
          hasError
            ? 'border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]'
            : 'border-[#2a2a45] focus:shadow-[0_0_0_3px_rgba(108,71,255,0.2)]'
        "
        @input="handleInput($event, index)"
        @keydown="handleKeydown($event, index)"
        @paste="handlePaste($event, index)"
      />
    </div>

    <p v-if="hasError" class="mt-1 p-1 text-xs text-red-400">{{ error }}</p>
  </div>
</template>
