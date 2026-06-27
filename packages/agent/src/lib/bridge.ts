// Asks the extension (via its content script) for the latest notes, automatically.
// Resolves with the notes, or null if no extension answered within the timeout
// (e.g. the extension isn't installed — the app then falls back to manual import).

import type { Note } from "@milo/shared";

export function requestNotesFromExtension(timeoutMs = 1500): Promise<Note[] | null> {
  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      if ((event.data as { type?: string } | null)?.type !== "milo:notes") return;
      cleanup();
      resolve((event.data as { notes: Note[] }).notes);
    };

    const timer = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);

    function cleanup() {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    }

    window.addEventListener("message", onMessage);
    window.postMessage({ type: "milo:request-notes" }, "*");
  });
}
