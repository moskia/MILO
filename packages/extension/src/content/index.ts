// Content script entry. Runs on every page. Detects selections, shows the
// Capture button, and fires a capture/start request.
//
// IMPORTANT: this entry must stay free of *runtime* imports shared with other
// build entries (it's a classic content script that can't use `import`). It only
// imports its own submodules (bundled in) and TYPE-ONLY symbols from @milo/shared
// (erased at build time), and talks to the background via chrome.* directly.

import type { CaptureInput, Event, Request } from "@milo/shared";
import { injectStyles } from "./styles";
import { hideCaptureButton, showCaptureButton } from "./capture-button";
import { showToast } from "./notify";

const MIN_SELECTION_LENGTH = 10;
let lastSelection = "";

function init(): void {
  injectStyles();
  document.addEventListener("mouseup", (event) => void onMouseUp(event));

  chrome.runtime.onMessage.addListener((message: unknown) => {
    const event = message as Event;
    if (event && event.type === "task/complete") {
      showToast(`Saved: ${event.title}`);
    }
  });
}

async function onMouseUp(event: MouseEvent): Promise<void> {
  const target = event.target as HTMLElement | null;
  if (target?.closest("#milo-capture-btn")) return;

  const settings = await chrome.storage.local.get({ captureOnSelect: true });
  if (!settings.captureOnSelect) {
    hideCaptureButton();
    return;
  }

  const text = window.getSelection()?.toString().trim() ?? "";
  if (text.length > MIN_SELECTION_LENGTH) {
    lastSelection = text;
    showCaptureButton(event.pageX, event.pageY, startCapture);
  } else {
    hideCaptureButton();
  }
}

function startCapture(): void {
  hideCaptureButton();

  const input: CaptureInput = {
    selectedText: lastSelection,
    source: { url: window.location.href, pageTitle: document.title },
    topicId: null,
  };
  const request: Request = { type: "capture/start", input };

  void chrome.runtime.sendMessage(request).catch(() => {
    showToast("MILO: reload this page to capture");
  });
  showToast("Capturing…");
}

init();
