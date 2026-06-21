// The one place that reads and writes the `notes` array in chrome.storage.local.
// Every handler goes through this repository instead of touching storage directly.

import type { Note } from "@milo/shared";

const KEY = "notes";

async function readAll(): Promise<Note[]> {
  const result = await chrome.storage.local.get(KEY);
  return (result[KEY] as Note[] | undefined) ?? [];
}

async function writeAll(notes: Note[]): Promise<void> {
  await chrome.storage.local.set({ [KEY]: notes });
}

export const NoteRepository = {
  list(): Promise<Note[]> {
    return readAll();
  },

  async get(id: string): Promise<Note | null> {
    const notes = await readAll();
    return notes.find((note) => note.id === id) ?? null;
  },

  /** Saves a new note at the front of the list (newest first). */
  async save(note: Note): Promise<Note> {
    const notes = await readAll();
    notes.unshift(note);
    await writeAll(notes);
    return note;
  },

  async update(id: string, patch: Partial<Note>): Promise<Note | null> {
    const notes = await readAll();
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) return null;

    const updated: Note = { ...notes[index]!, ...patch, id, updatedAt: Date.now() };
    notes[index] = updated;
    await writeAll(notes);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const notes = await readAll();
    await writeAll(notes.filter((note) => note.id !== id));
  },

  /** Clears all notes; returns how many were removed. */
  async clear(): Promise<number> {
    const notes = await readAll();
    await writeAll([]);
    return notes.length;
  },
};
