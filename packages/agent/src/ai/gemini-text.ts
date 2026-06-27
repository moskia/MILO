// On-device text generation via Chrome's Prompt API (Gemini Nano).
// Copied from the extension; implements the @milo/shared `TextGenerator` interface.

import type { CompletionOptions, TextGenerator } from "@milo/shared";
import { lazySession } from "./lazy-session";

const getSession = lazySession(async () => {
  if (typeof LanguageModel === "undefined") {
    throw new Error("Prompt API (LanguageModel) is not available in this browser");
  }
  const availability = await LanguageModel.availability();
  if (availability === "unavailable") {
    throw new Error("Prompt API model is unavailable on this device");
  }
  return LanguageModel.create({
    monitor(monitor) {
      monitor.addEventListener("downloadprogress", (event) => {
        console.log(`[MILO] Prompt model: ${Math.round(event.loaded * 100)}%`);
      });
    },
  });
});

export const geminiTextGenerator: TextGenerator = {
  id: "gemini-nano",

  async isAvailable() {
    if (typeof LanguageModel === "undefined") return false;
    try {
      return (await LanguageModel.availability()) !== "unavailable";
    } catch {
      return false;
    }
  },

  async complete(prompt: string, _options?: CompletionOptions) {
    const session = await getSession();
    const output = await session.prompt(prompt);
    return output.trim();
  },
};
