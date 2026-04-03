/// <reference types="vite/client" />

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresRole?: "admin";
    public?: boolean;
  }
}

declare module "motion-v" {
  export const motion: Record<string, any>;
}
