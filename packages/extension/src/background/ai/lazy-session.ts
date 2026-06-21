// Runs an async factory at most once and shares the in-flight promise with all
// concurrent callers. On failure the cache is cleared so the next call retries.
//
// This single helper replaces MindStack's pattern of a global session variable +
// an `isInitializing` flag + a `while (isInitializing) sleep(100)` poll loop that
// was copy-pasted before every AI call. Callers just `await getSession()`.

export function lazySession<T>(factory: () => Promise<T>): () => Promise<T> {
  let cached: Promise<T> | null = null;

  return () => {
    if (cached === null) {
      cached = factory().catch((error: unknown) => {
        cached = null; // allow a retry on the next call
        throw error;
      });
    }
    return cached;
  };
}
