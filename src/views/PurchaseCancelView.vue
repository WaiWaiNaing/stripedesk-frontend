<template>
  <section class="mx-auto max-w-3xl">
    <div class="rounded-[32px] border border-rose-400/20 bg-rose-400/10 p-8 text-center">
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/15 text-2xl text-rose-200"
      >
        !
      </div>
      <p class="mt-6 text-sm uppercase tracking-[0.28em] text-rose-200/70">Purchase canceled</p>
      <h1 class="mt-3 text-3xl font-semibold text-white">Checkout was interrupted</h1>
      <p class="mt-4 text-sm leading-6 text-slate-200">
        The dedicated cancel route from the reference app remains available for retry and messaging.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <router-link
          to="/shop"
          class="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950"
        >
          Return to shop
        </router-link>
        <router-link
          to="/dashboard"
          class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white"
        >
          Back to dashboard
        </router-link>
      </div>
    </div>
  </section>
</template>
