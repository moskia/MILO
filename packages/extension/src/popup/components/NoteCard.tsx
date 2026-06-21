import type { Note } from "@milo/shared";
import { Tag } from "./ui";

export function NoteCard({
  note,
  selected,
  onSelect,
}: {
  note: Note;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? "border-indigo-400 bg-indigo-50/60"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="truncate text-sm font-semibold text-zinc-800">{note.title}</div>
      {note.summary && (
        <div className="mt-1 line-clamp-2 text-xs text-zinc-500">{note.summary}</div>
      )}
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </button>
  );
}
