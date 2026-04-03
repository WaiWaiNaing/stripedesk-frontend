import { onScopeDispose, ref, watch, type Ref } from "vue";

export type DebouncedFn<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

/**
 * Returns a debounced wrapper; call `cancel()` to drop pending invocations (e.g. on unmount).
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): DebouncedFn<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const wrapped = (...args: Args) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, waitMs);
  };

  wrapped.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  return wrapped;
}

/**
 * `source` updates immediately (e.g. v-model); `debounced` updates after `waitMs` of quiet time.
 */
export function useDebouncedRef<T>(initial: T, waitMs: number): { source: Ref<T>; debounced: Ref<T> } {
  const source = ref(initial) as Ref<T>;
  const debounced = ref(initial) as Ref<T>;
  const run = debounce((v: T) => {
    debounced.value = v;
  }, waitMs);

  watch(source, (v) => run(v));
  onScopeDispose(() => run.cancel());

  return { source, debounced };
}
