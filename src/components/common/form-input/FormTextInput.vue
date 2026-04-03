<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  modelValue: string;
  type?: "text" | "email" | "password";
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  label: "",
  placeholder: "",
  autocomplete: "",
  error: "",
});

defineEmits<{
  "update:modelValue": [value: string];
}>();

const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === "password") return showPassword.value ? "text" : "password";
  return props.type;
});

const hasError = computed(() => !!props.error);
</script>

<template>
  <div>
    <label
      v-if="label"
      class="block text-[#a0a0c0] text-[13px] font-medium tracking-[0.2px] mb-1.5"
    >
      {{ label }}
    </label>

    <div class="relative flex items-center">
      <div class="absolute left-3.5 text-[#4a4a6a] pointer-events-none shrink-0">
        <slot name="icon" />
      </div>

      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="w-full h-11 bg-[#1a1a2e] border rounded-[10px] text-[#e0e0f0] text-[15px] pl-10 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#4a4a6a] hover:border-[#6c47ff] focus:border-[#6c47ff]"
        :class="[
          hasError
            ? 'border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]'
            : 'border-[#2a2a45] focus:shadow-[0_0_0_3px_rgba(108,71,255,0.2)]',
          type === 'password' ? 'pr-11' : 'pr-3.5',
        ]"
      />

      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4a6a] bg-transparent border-0 cursor-pointer p-0 flex items-center transition-colors duration-200 hover:text-[#a0a0c0]"
      >
        <svg
          v-if="!showPassword"
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
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg
          v-else
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
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </button>
    </div>

    <p v-if="hasError" class="mt-1 p-1 text-xs text-red-400">{{ error }}</p>
  </div>
</template>
