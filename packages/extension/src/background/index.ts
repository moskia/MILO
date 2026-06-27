// Service worker entry point. Wires up the message router and warms the on-device
// models so the first capture is snappier.

import { registerRouter } from "./router";
import { geminiTextGenerator } from "./ai/gemini-text";
import { geminiSummarizer } from "./ai/gemini-summary";
import { backfillEmbeddings } from "./maintenance/backfill";

console.log("[MILO] background service worker started");

registerRouter();
void backfillEmbeddings();

// Best-effort availability checks (also nudge Chrome to provision the models).
void geminiTextGenerator.isAvailable();
void geminiSummarizer.isAvailable();

chrome.runtime.onInstalled.addListener(() => {
  console.log("[MILO] extension installed / updated");
});
