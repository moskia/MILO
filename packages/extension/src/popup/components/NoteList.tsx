import type { Note } from "@milo/shared";
import { NoteCard } from "./NoteCard";

export function NoteList({
  notes,
  selectedId,
  onSelect,
}: {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (notes.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-zinc-400">
        No notes yet. Highlight text on any page and click Capture.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          selected={note.id === selectedId}
          onSelect={() => onSelect(note.id)}
        />
      ))}
    </div>
  );
}
