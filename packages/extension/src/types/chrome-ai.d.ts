// Ambient types for Chrome's experimental built-in AI (Gemini Nano).
// These are global constructors Chrome injects when the feature/flags are enabled;
// they are NOT in @types/chrome. We declare only the surface MILO uses.
// At runtime, always guard with `typeof LanguageModel !== "undefined"` first.

type AIAvailability = "unavailable" | "downloadable" | "downloading" | "available";

interface AIMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (event: { loaded: number }) => void,
  ): void;
}

// --- Prompt API (LanguageModel) ---
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

// --- Summarizer API ---
interface SummarizerSession {
  summarize(input: string, options?: { context?: string }): Promise<string>;
  destroy(): void;
}

interface SummarizerCreateOptions {
  type?: "tldr" | "teaser" | "key-points" | "headline";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
  outputLanguage?: string;
  monitor?: (monitor: AIMonitor) => void;
}

declare const Summarizer: {
  availability(): Promise<AIAvailability>;
  create(options?: SummarizerCreateOptions): Promise<SummarizerSession>;
};
