import { useEffect, useState } from "react";
import type { Note } from "@milo/shared";
import { loadNotes } from "./lib/store";
import { ImportScreen } from "./components/ImportScreen";
import { SubjectBar } from "./components/SubjectBar";
import { semanticRetrieve } from "./lib/retrieve";
import { summarizeLearning } from "./agent/summarize";
import { Chat } from "./components/Chat";

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [subject, setSubject] = useState("");
  const [related, setRelated] = useState<Note[]>([]);
  const [searching, setSearching] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  // Retrieval is async (it embeds the subject), so it runs in an effect.
  useEffect(() => {
    const q = subject.trim();
    setSummary(null); // a new subject makes the old summary stale
    if (q === "") {
      setRelated([]);
      return;
    }
    let active = true;
    setSearching(true);
    void semanticRetrieve(q, notes).then((found) => {
      if (!active) return;
      setRelated(found);
      setSearching(false);
    });
    return () => {
      active = false;
    };
  }, [subject, notes]);

  const onSummarize = async () => {
    setSummarizing(true);
    try {
      setSummary(await summarizeLearning(subject, related));
    } catch {
      setSummary("Couldn't generate a summary. Is Chrome's built-in AI enabled?");
    } finally {
      setSummarizing(false);
    }
  };

  if (notes.length === 0) {
    return <ImportScreen onImported={() => setNotes(loadNotes())} />;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-xl font-bold text-indigo-700">
        MILO — your learning companion
      </h1>

      <SubjectBar value={subject} onChange={setSubject} />

      {related.length > 0 && (
        <button
          onClick={onSummarize}
          disabled={summarizing}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {summarizing ? "Thinking…" : "What have I learned?"}
        </button>
      )}

      {summary && (
        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-indigo-50 p-4 text-sm text-zinc-700">
          {summary}
        </div>
      )}

      <div className="mt-4">
        {subject.trim() === "" ? (
          <p className="text-sm text-zinc-500">
            {notes.length} notes loaded. Type a subject above.
          </p>
        ) : searching ? (
          <p className="text-sm text-zinc-500">Searching…</p>
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

      <Chat notes={notes} />
    </div>
  );
}
