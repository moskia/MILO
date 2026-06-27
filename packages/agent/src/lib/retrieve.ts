import type { Note } from "@milo/shared";
import { cosineSimilarity } from "@milo/shared";
import { miniLMEmbedder } from "../ai/embedder";

/** Exact-word match across title/content/tags. */
export function keywordRetrieve(subject: string, notes: Note[]): Note[] {
  const q = subject.toLowerCase().trim();
  if (!q) return [];
  return notes.filter((note) =>
    [note.title, note.content, note.tags.join(" ")].join(" ").toLowerCase().includes(q),
  );
}

const SIMILARITY_THRESHOLD = 0.35;

/** Meaning-based match: embed the subject, rank notes by cosine similarity. */
export async function semanticRetrieve(subject: string, notes: Note[]): Promise<Note[]> {
  const q = subject.trim();
  if (!q) return [];

  const queryVector = await miniLMEmbedder.embed(q);

  const scored: { note: Note; score: number }[] = [];
  for (const note of notes) {
    if (!note.embedding) continue; // skip notes without vectors
    const score = cosineSimilarity(queryVector, note.embedding);
    if (score >= SIMILARITY_THRESHOLD) scored.push({ note, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.note);
}
