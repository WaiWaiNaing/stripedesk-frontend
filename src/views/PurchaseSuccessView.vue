<template>
  <section class="mx-auto max-w-3xl">
    <div class="rounded-[32px] border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-2xl text-emerald-200"
      >
        ✓
      </div>
      <p class="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-200/70">Purchase success</p>
      <h1 class="mt-3 text-3xl font-semibold text-white">Checkout completed</h1>
      <p class="mt-4 text-sm leading-6 text-slate-200">
        This preserves the source app's success destination so you can wire the post-checkout handoff
        later.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <router-link
          to="/dashboard"
          class="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950"
        >
          Go to dashboard
        </router-link>
        <router-link
          to="/invoices"
          class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white"
        >
          View invoices
        </router-link>
      </div>
    </div>
  </section>
</template>
