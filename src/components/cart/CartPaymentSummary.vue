<script setup lang="ts">
import { ref } from "vue";
import AlertModalBox from "@/components/common/AlertModalBox.vue";
import AppButton from "@/components/ui/AppButton.vue";

interface Props {
  subtotal: string;
  canCheckout: boolean;
  checkoutPending: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  checkout: [];
}>();

const confirmOpen = ref(false);

function openConfirm() {
  if (!props.canCheckout || props.checkoutPending) return;
  confirmOpen.value = true;
}

function onConfirmCheckout() {
  emit("checkout");
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl"
  >
    <div class="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
        <p class="mt-0.5 text-2xl font-semibold tabular-nums text-white">{{ subtotal }}</p>
      </div>
      <div class="w-full sm:w-auto sm:min-w-[220px]">
        <AppButton
          class="w-full justify-center px-3"
          :disabled="!canCheckout"
          :loading="checkoutPending"
          @click="openConfirm"
        >
          Continue to payment
        </AppButton>
      </div>
    </div>

    <AlertModalBox
      v-model="confirmOpen"
      title="Continue to payment?"
      :description="`You will leave this page to complete checkout securely. Total: ${subtotal}.`"
      confirm-text="Continue"
      cancel-text="Not now"
      @confirm="onConfirmCheckout"
    />
  </div>
</template>
