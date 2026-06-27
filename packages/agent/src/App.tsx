import { useEffect, useState } from "react";
import type { Note } from "@milo/shared";
import { loadNotes, saveNotes } from "./lib/store";
import { requestNotesFromExtension } from "./lib/bridge";
import { ImportScreen } from "./components/ImportScreen";
import { SubjectBar } from "./components/SubjectBar";
import { semanticRetrieve } from "./lib/retrieve";
import { summarizeLearning } from "./agent/summarize";
import { findGaps } from "./agent/gaps";
import { Chat } from "./components/Chat";
import { Quiz } from "./components/Quiz";

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [subject, setSubject] = useState("");
  const [related, setRelated] = useState<Note[]>([]);
  const [searching, setSearching] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [gaps, setGaps] = useState<string | null>(null);
  const [findingGaps, setFindingGaps] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Automatically pull the latest notes from the extension.
  const syncFromExtension = async () => {
    setSyncing(true);
    const fresh = await requestNotesFromExtension();
    if (fresh) {
      setNotes(fresh);
      saveNotes(fresh); // cache so the app still works if the extension is closed
    }
    setSyncing(false);
  };

  // Sync once on load.
  useEffect(() => {
    void syncFromExtension();
  }, []);

  // Async retrieval whenever the subject (or the notes) change.
  useEffect(() => {
    const q = subject.trim();
    setSummary(null);
    setGaps(null);
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

  const onFindGaps = async () => {
    setFindingGaps(true);
    try {
      setGaps(await findGaps(subject, related));
    } catch {
      setGaps("Couldn't find gaps. Is Chrome's built-in AI enabled?");
    } finally {
      setFindingGaps(false);
    }
  };

  if (notes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <ImportScreen onImported={() => setNotes(loadNotes())} />
        <button
          onClick={syncFromExtension}
          disabled={syncing}
          className="mt-3 text-sm font-medium text-indigo-600 hover:underline disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "Or sync automatically from the extension"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-700">MILO — your learning companion</h1>
        <button
          onClick={syncFromExtension}
          disabled={syncing}
          className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "↻ Sync"}
        </button>
      </div>

      <SubjectBar value={subject} onChange={setSubject} />

      {related.length > 0 && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onSummarize}
            disabled={summarizing}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {summarizing ? "Thinking…" : "What have I learned?"}
          </button>
          <button
            onClick={onFindGaps}
            disabled={findingGaps}
            className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
          >
            {findingGaps ? "Looking…" : "What am I missing?"}
          </button>
        </div>
      )}

      {summary && (
        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-indigo-50 p-4 text-sm text-zinc-700">
          {summary}
        </div>
      )}

      {gaps && (
        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-amber-50 p-4 text-sm text-zinc-700">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
            Gaps to fill
          </div>
          {gaps}
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

      {related.length > 0 && <Quiz subject={subject} notes={related} />}

      <Chat notes={notes} />
    </div>
  );
}
