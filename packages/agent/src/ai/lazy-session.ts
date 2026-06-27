// Runs an async factory at most once and shares the in-flight promise with all
// concurrent callers. On failure the cache is cleared so the next call retries.
// Copied from the extension — callers just `await getModel()`.

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
