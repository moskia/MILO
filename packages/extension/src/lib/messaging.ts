// Typed wrappers over chrome.runtime messaging, used by the popup.
// `sendRequest` infers the response type from the request `type`, so callers get
// full type-checking on both sides of the wire. `onEvent` subscribes to the
// background's broadcasts.
//
// NOTE: the content script does NOT import this (it must stay import-free of
// runtime code shared with other entries); it calls chrome.* directly.

import type { Event, Request, ResponseFor } from "@milo/shared";

export async function sendRequest<R extends Request>(
  request: R,
): Promise<ResponseFor<R["type"]>> {
  const response = await chrome.runtime.sendMessage(request);
  return response as ResponseFor<R["type"]>;
}

const EVENT_TYPES = new Set<Event["type"]>([
  "notes/changed",
  "task/update",
  "task/complete",
  "task/error",
]);

function isEvent(message: unknown): message is Event {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    EVENT_TYPES.has((message as { type: Event["type"] }).type)
  );
}

/** Subscribe to background broadcasts. Returns an unsubscribe function. */
export function onEvent(handler: (event: Event) => void): () => void {
  const listener = (message: unknown): void => {
    if (isEvent(message)) handler(message);
  };
  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
}
