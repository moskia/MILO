import { useState } from "react";
import type { Note } from "@milo/shared";
import { loadNotes } from "./lib/store";
import { ImportScreen } from "./components/ImportScreen";
import { SubjectBar } from "./components/SubjectBar";
import { keywordRetrieve } from "./lib/retrieve";

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [subject, setSubject] = useState("");

  if (notes.length === 0) {
    return <ImportScreen onImported={() => setNotes(loadNotes())} />;
  }

  const related = keywordRetrieve(subject, notes);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-xl font-bold text-indigo-700">
        MILO — your learning companion
      </h1>

      <SubjectBar value={subject} onChange={setSubject} />

      <div className="mt-4">
        {subject.trim() === "" ? (
          <p className="text-sm text-zinc-500">
            {notes.length} notes loaded. Type a subject above.
          </p>
        ) : related.length === 0 ? (
          <p className="text-sm text-zinc-500">No notes match “{subject}”.</p>
        ) : (
          <ul className="space-y-2">
            {related.map((note) => (
              <li key={note.id} className="rounded-lg border border-zinc-200 p-3">
                <div className="font-medium text-zinc-800">{note.title}</div>
                {note.summary && (
                  <div className="mt-1 text-sm text-zinc-500">{note.summary}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
