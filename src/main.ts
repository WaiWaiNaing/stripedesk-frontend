import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/styles/style.css";

import App from "./App.vue";
import router from "./router";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

const queryClient = new QueryClient();

app.use(VueQueryPlugin, {
  queryClient,
});

app.use(createPinia());
app.use(router);

app.mount("#app");
