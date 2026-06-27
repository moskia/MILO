import { useEffect, useMemo, useState } from "react";
import type { Note } from "@milo/shared";
import { Brain } from "lucide-react";
import { useNotes } from "./hooks/useNotes";
import { useCaptureTasks } from "./hooks/useCaptureTasks";
import { sendRequest } from "../lib/messaging";
import { SearchBar } from "./components/SearchBar";
import { Settings } from "./components/Settings";
import { NoteList } from "./components/NoteList";
import { NoteDetail } from "./components/NoteDetail";
import { TaskCard } from "./components/TaskCard";
import { Toast } from "./components/Toast";
import { ExportButton } from "./components/ExportButton";

export function App() {
  const { notes, reload } = useNotes();
  const tasks = useCaptureTasks();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"keyword" | "semantic">("keyword");

  // Run a keyword search when the query is non-empty; otherwise show all notes.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      return;
    }
    let active = true;
    void sendRequest({ type: "search/run", query: q, mode: searchMode }).then((response) => {
      if (active && response.ok) setResults(response.data.map((result) => result.note));
    });
    return () => {
      active = false;
    };
  }, [query, searchMode]);

  const visible = results ?? notes;
  const selected = useMemo(
    () => notes.find((note) => note.id === selectedId) ?? null,
    [notes, selectedId],
  );

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-1.5 font-bold text-indigo-700">
          <Brain className="h-5 w-5" />
          MILO
        </div>
        <SearchBar value={query} onChange={setQuery} />
        <button
          type="button"
          onClick={() => setSearchMode((m) => (m === "keyword" ? "semantic" : "keyword"))}
          className="shrink-0 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
          title="Switch search mode"
        >
          {searchMode === "semantic" ? "Meaning" : "Exact"}
        </button>
        <ExportButton />
        <Settings />
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-2/5 flex-col gap-2 overflow-auto border-r border-zinc-200 p-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          <NoteList notes={visible} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        <main className="min-w-0 flex-1 overflow-auto p-4">
          {selected ? (
            <NoteDetail
              note={selected}
              onChanged={() => {
                void reload();
                setToast("Saved");
              }}
              onDeleted={() => {
                setSelectedId(null);
                void reload();
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              Select a note to view it.
            </div>
          )}
        </main>
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
