import { useState } from "react";
import type { Note } from "@milo/shared";
import { loadNotes } from "./lib/store";
import { ImportScreen } from "./components/ImportScreen";

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  if (notes.length === 0) {
    return <ImportScreen onImported={() => setNotes(loadNotes())} />;
  }
  return <div className="p-6">{notes.length} notes loaded ✅</div>;
}
