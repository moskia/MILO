// The domain model — the "nouns" MILO is built around.
// These types are the single source of truth; the extension stores them and the
// agent reasons over them.

/** Where a note was captured from. */
export interface NoteSource {
  url: string;
  pageTitle: string;
}

/**
 * A single thing the learner captured — a snippet, an explanation, a fix.
 * In MindStack this was a "Solution"; in MILO it's a unit of knowledge that
 * belongs to a Topic the learner is studying.
 */
export interface Note {
  id: string;
  /** The topic this note belongs to, or null if not yet sorted. */
  topicId: string | null;
  title: string;
  /** The captured text (lightly formatted, e.g. code wrapped in backticks). */
  content: string;
  /** Short AI-generated summary. */
  summary: string;
  tags: string[];
  source: NoteSource;
  /** The learner's own annotations on top of the captured content. */
  userNotes: string;
  /** Semantic vector for similarity search; null until indexed. */
  embedding: number[] | null;
  /** Which embedding model produced `embedding` (for safe re-indexing). */
  embeddingModel: string | null;
  createdAt: number;
  updatedAt: number;
}

/** A subject the learner is studying. Notes are grouped under topics. */
export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

/** How a search query is matched against notes. */
export type SearchMode = "keyword" | "semantic";

/** A note plus how well it matched a query (0..1; keyword hits use 1). */
export interface SearchResult {
  note: Note;
  score: number;
}

/** The minimal data needed to start a capture; the pipeline fills in the rest. */
export interface CaptureInput {
  selectedText: string;
  source: NoteSource;
  topicId: string | null;
}

/** Which enrichment steps a capture runs through. */
export interface CaptureProgress {
  format: boolean;
  title: boolean;
  tags: boolean;
  summary: boolean;
  indexing: boolean;
}

/**
 * A capture that is being processed in the background. Lives only in memory in
 * the service worker; the popup mirrors it for the live progress UI.
 */
export interface CaptureTask {
  id: string;
  status: "processing" | "done" | "error";
  progress: CaptureProgress;
  pageTitle: string;
  startedAt: number;
  /** Partial result shown while steps complete (title/summary/tags so far). */
  preview: {
    title: string;
    summary: string;
    tags: string[];
  };
}
