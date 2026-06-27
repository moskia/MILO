import type { ChangeEvent } from "react";
import type { MiloExport } from "@milo/shared";
import { CURRENT_EXPORT_VERSION } from "@milo/shared";
import { saveNotes } from "../lib/store";

export function ImportScreen({ onImported }: { onImported: () => void }) {
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = JSON.parse(await file.text()) as MiloExport;
    if (data.version !== CURRENT_EXPORT_VERSION) {
      alert("Unsupported file version");
      return;
    }
    saveNotes(data.notes);
    onImported();
  };

  return (
    <div className="p-6">
      <p className="mb-2 text-sm text-zinc-600">Import your milo-notes.json:</p>
      <input type="file" accept="application/json" onChange={onFile} />
    </div>
  );
}
