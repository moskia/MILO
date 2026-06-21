// Keyword search over notes. Semantic search (embeddings) arrives in Step 3 and
// will fall back to this when a query can't be embedded.

import type { Note, SearchResult } from "@milo/shared";

export function keywordSearch(query: string, notes: Note[]): SearchResult[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  const terms = normalized.split(/\s+/).filter(Boolean);

  return notes
    .filter((note) => {
      const haystack = [
        note.title,
        note.content,
        note.summary,
        note.userNotes,
        note.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      // Exact phrase match, or any single term present.
      return haystack.includes(normalized) || terms.some((term) => haystack.includes(term));
    })
    .map((note) => ({ note, score: 1 }));
}
