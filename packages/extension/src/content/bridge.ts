// Automatic bridge to the MILO agent web app.
//
// The content script already runs on every page, including the agent's localhost
// page. When the agent asks (via window.postMessage), we read the captured notes
// from storage and hand them back. We only answer an explicit request, and only
// on localhost, so other websites can't read your notes.

export function initAgentBridge(): void {
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if ((event.data as { type?: string } | null)?.type !== "milo:request-notes") return;
    if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;

    void chrome.storage.local.get("notes").then((result) => {
      window.postMessage({ type: "milo:notes", notes: result.notes ?? [] }, "*");
    });
  });
}
