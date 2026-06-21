// Fire-and-forget broadcasts from the background to the popup (runtime) and to
// every tab's content script. Replaces MindStack's untyped `notifyPopup`.

import type { Event } from "@milo/shared";

export function broadcast(event: Event): void {
  // Popup / other extension pages (no-op if none are open).
  chrome.runtime.sendMessage(event).catch(() => {});

  // Content scripts in every tab (no-op for tabs without one).
  void chrome.tabs.query({}).then((tabs) => {
    for (const tab of tabs) {
      if (tab.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, event).catch(() => {});
      }
    }
  });
}
