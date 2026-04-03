<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { LogOut, User } from "@lucide/vue";
import UiDropdownMenu from "@/components/ui/UiDropdownMenu.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const initials = computed(() => {
  const name = auth.user?.name?.trim() ?? "";
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const displayName = computed(() => auth.user?.name ?? "Workspace user");
const displayEmail = computed(() => auth.user?.email ?? "signed-in account");

async function handleLogout(close: () => void) {
  close();
  auth.logout();
  await router.push("/login");
}
</script>

<template>
  <UiDropdownMenu align="right">
    <template #trigger="{ open }">
      <button
        type="button"
        class="flex h-10 w-10 shrink-0 items-center cursor-pointer justify-center hover:border rounded-full bg-linear-to-br from-indigo-500/80 to-amber-600/80 text-sm font-semibold text-white shadow-inner shadow-black/20 outline-none ring-indigo-400/50 transition"
        :aria-expanded="open"
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {{ initials }}
      </button>
    </template>

    <template #default="{ close }">
      <div class="px-1 py-1">
        <div class="px-3 py-2">
          <p class="text-sm font-medium text-white">{{ displayName }}</p>
          <p class="text-xs text-slate-400">{{ displayEmail }}</p>
        </div>

        <div class="my-1 h-px bg-white/10" />
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
          role="menuitem"
          @click="handleLogout(close)"
        >
          <LogOut class="h-4 w-4 text-slate-400" />
          Log out
        </button>
      </div>
    </template>
  </UiDropdownMenu>
</template>
