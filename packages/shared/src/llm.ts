// The swappable AI layer.
//
// MILO never calls a model directly. It calls these interfaces, so the on-device
// Gemini Nano implementation can be replaced with Claude (or anything) later
// without changing capture/search/agent logic.
//
// Text generation and embeddings are *different* models, so they're separate
// interfaces — a provider may implement one, the other, or both.

export interface CompletionOptions {
  /** System / role instruction, if the backend supports one. */
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

/** Generates text from a prompt (titles, tags, summaries, agent answers). */
export interface TextGenerator {
  /** Stable id, e.g. "gemini-nano" or "claude". */
  readonly id: string;
  /** Whether this backend is usable right now (model present, flags enabled…). */
  isAvailable(): Promise<boolean>;
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
}

/** Condenses text into a short summary (Chrome's dedicated Summarizer API). */
export interface Summarizer {
  /** Stable id, e.g. "gemini-nano-summarizer". */
  readonly id: string;
  isAvailable(): Promise<boolean>;
  summarize(text: string): Promise<string>;
}

/** Turns text into a fixed-length semantic vector. */
export interface Embedder {
  /** Stable id of the embedding model, stored on each note as `embeddingModel`. */
  readonly id: string;
  /** Length of the vectors this embedder produces (e.g. 384). */
  readonly dimensions: number;
  isAvailable(): Promise<boolean>;
  embed(text: string): Promise<number[]>;
}
