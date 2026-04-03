<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <Toaster position="top-right" theme="dark" :rich-colors="true" :close-button="true" />
  <router-view />
</template>
