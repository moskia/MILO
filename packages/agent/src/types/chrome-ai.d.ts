// Ambient types for Chrome's experimental Prompt API (Gemini Nano), used by the
// agent's text generator. Copied from the extension (LanguageModel only).
// At runtime, always guard with `typeof LanguageModel !== "undefined"` first.

type AIAvailability = "unavailable" | "downloadable" | "downloading" | "available";

interface AIMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (event: { loaded: number }) => void,
  ): void;
}

interface LanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface LanguageModelCreateOptions {
  initialPrompts?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  monitor?: (monitor: AIMonitor) => void;
}

declare const LanguageModel: {
  availability(): Promise<AIAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
};
