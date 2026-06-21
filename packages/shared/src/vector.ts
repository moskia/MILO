// Pure vector math for semantic search. No dependencies, easy to unit-test.

/**
 * Cosine similarity of two equal-length vectors, in [-1, 1] (typically [0, 1]
 * for normalized embeddings). Returns 0 for mismatched/empty inputs or a
 * zero-length vector, so callers never divide by zero.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
