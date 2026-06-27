import { sendRequest } from "../../lib/messaging";

export function ExportButton() {
  const onExport = async () => {
    const res = await sendRequest({ type: "export/bundle" });
    if (!res.ok) return;
    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "milo-notes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={onExport}
      className="shrink-0 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
    >
      Export
    </button>
  );
}
