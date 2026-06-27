import type { Note } from "@milo/shared";

export function keywordRetrieve(subject: string, notes: Note[]): Note[] {
  const q = subject.toLowerCase().trim();
  if (!q) return [];
  return notes.filter((note) =>
    [note.title, note.content, note.tags.join(" ")].join(" ").toLowerCase().includes(q),
  );
}
