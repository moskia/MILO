// On-device summarization via Chrome's Summarizer API (Gemini Nano).
// Implements the @milo/shared `Summarizer` interface.

import type { Summarizer as SummarizerProvider } from "@milo/shared";
import { lazySession } from "./lazy-session";

const getSession = lazySession(async () => {
  if (typeof Summarizer === "undefined") {
    throw new Error("Summarizer API is not available in this browser");
  }
  const availability = await Summarizer.availability();
  if (availability === "unavailable") {
    throw new Error("Summarizer model is unavailable on this device");
  }
  return Summarizer.create({
    type: "tldr",
    format: "markdown",
    length: "short",
    outputLanguage: "en",
    monitor(monitor) {
      monitor.addEventListener("downloadprogress", (event) => {
        console.log(`[MILO] Summarizer model: ${Math.round(event.loaded * 100)}%`);
      });
    },
  });
});

export const geminiSummarizer: SummarizerProvider = {
  id: "gemini-nano-summarizer",

  async isAvailable() {
    if (typeof Summarizer === "undefined") return false;
    try {
      return (await Summarizer.availability()) !== "unavailable";
    } catch {
      return false;
    }
  },

  async summarize(text: string) {
    const session = await getSession();
    const output = await session.summarize(text);
    return output.trim();
  },
};
