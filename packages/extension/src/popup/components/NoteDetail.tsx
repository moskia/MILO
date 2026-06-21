import { useEffect, useState } from "react";
import type { Note } from "@milo/shared";
import { Check, ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { sendRequest } from "../../lib/messaging";
import { Button, Tag } from "./ui";

export function NoteDetail({
  note,
  onChanged,
  onDeleted,
}: {
  note: Note;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [tags, setTags] = useState(note.tags.join(", "));
  const [userNotes, setUserNotes] = useState(note.userNotes);

  // Reset the form whenever a different note is selected.
  useEffect(() => {
    setEditing(false);
    setTitle(note.title);
    setTags(note.tags.join(", "));
    setUserNotes(note.userNotes);
  }, [note]);

  const save = async () => {
    const response = await sendRequest({
      type: "notes/update",
      id: note.id,
      patch: { title: title.trim(), tags: parseTags(tags), userNotes },
    });
    if (response.ok) {
      setEditing(false);
      onChanged();
    }
  };

  const remove = async () => {
    const response = await sendRequest({ type: "notes/delete", id: note.id });
    if (response.ok) onDeleted();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        {editing ? (
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="flex-1 rounded-lg border border-zinc-200 px-2 py-1 text-base font-semibold outline-none focus:border-indigo-400"
          />
        ) : (
          <h2 className="text-base font-semibold text-zinc-900">{note.title}</h2>
        )}

        <div className="flex shrink-0 gap-1">
          {editing ? (
            <>
              <Button variant="ghost" onClick={save} aria-label="Save">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} aria-label="Cancel">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setEditing(true)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="danger" onClick={remove} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <a
        href={note.source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
      >
        <ExternalLink className="h-3 w-3" />
        <span className="truncate">{note.source.pageTitle || note.source.url}</span>
      </a>

      <div className="mt-3 flex flex-wrap gap-1">
        {editing ? (
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="comma, separated, tags"
            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
          />
        ) : (
          note.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
        )}
      </div>

      {note.summary && (
        <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Summary
          </div>
          {note.summary}
        </div>
      )}

      <div className="mt-3 flex-1 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700">
        {note.content}
      </div>

      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          My notes
        </div>
        {editing ? (
          <textarea
            value={userNotes}
            onChange={(event) => setUserNotes(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none focus:border-indigo-400"
          />
        ) : (
          <p className="text-sm text-zinc-600">
            {note.userNotes || <span className="text-zinc-400">No notes yet.</span>}
          </p>
        )}
      </div>
    </div>
  );
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}
