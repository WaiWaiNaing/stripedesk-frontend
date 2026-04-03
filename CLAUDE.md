# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn dev          # Start Vite dev server with HMR

# Build
yarn build        # Type-check + build for production (runs in parallel)
yarn build-only   # Build without type-checking
yarn preview      # Preview production build locally

# Type checking
yarn type-check   # Run vue-tsc for TypeScript validation

# Linting (both run together via `yarn lint`)
yarn lint         # Run oxlint + eslint with auto-fix
yarn lint:oxlint  # Oxlint only
yarn lint:eslint  # ESLint only (with cache)
```

There is no test runner configured yet.

## Architecture

This is a Vue 3 + TypeScript SPA scaffolded with Vite. The stack:

- **Vue 3** (Composition API) — all components should use `<script setup>`
- **Vue Router v5** — web history mode; routes defined in `src/router/index.ts`
- **Pinia** — state management; stores live in `src/stores/`
- **Vite** — build tool; `@/` is aliased to `src/`
- **Ant Design Vue 4** — UI component library; components are auto-imported on-demand via `unplugin-vue-components` (no manual imports needed). Base CSS is loaded globally in `main.ts` (`ant-design-vue/dist/reset.css`). Type definitions are auto-generated in `components.d.ts`.

### Entry flow

`index.html` → `src/main.ts` creates the app, registers Pinia and Router, mounts to `#app` → `App.vue` is the root component.

### Conventions

- Path alias `@/` maps to `src/` — use this for all internal imports
- Pinia stores use the composable (setup) style (see `src/stores/counter.ts`)
- ESLint (flat config) + Oxlint both run; ESLint defers to Oxlint for overlapping rules via the oxlint plugin
- TypeScript strict mode is on; `noUncheckedIndexedAccess` is enabled, so array/object access returns `T | undefined`

### VS Code

The `.vscode/` config recommends Volar, ESLint, EditorConfig, and Oxc extensions, with auto-fix on save. Volar (not Vetur) is required for Vue 3 TypeScript support.
