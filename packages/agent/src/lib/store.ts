import type { Note } from "@milo/shared";

const KEY = "milo-notes";

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(KEY, JSON.stringify(notes));
}

export function loadNotes(): Note[] {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Note[]) : [];
}
