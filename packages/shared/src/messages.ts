// The message contract between the extension's contexts (content script, popup,
// background). MindStack used loose `{ action: string, ...any }` objects; MILO
// uses discriminated unions so the compiler checks every message and handler.

import type { CaptureInput, Note, SearchMode, SearchResult, Topic } from "./domain";
import type { MiloExport } from "./sync";

/** A uniform success/error envelope for every response. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const err = (error: string): Result<never> => ({ ok: false, error });

/**
 * Every request the background worker understands. Add a case here and the
 * compiler will force you to handle it (and tell callers it exists).
 */
export type Request =
  | { type: "notes/list" }
  | { type: "notes/get"; id: string }
  | { type: "notes/update"; id: string; patch: Partial<Note> }
  | { type: "notes/delete"; id: string }
  | { type: "notes/clear" }
  | { type: "topics/list" }
  | { type: "capture/start"; input: CaptureInput }
  | { type: "search/run"; query: string; mode: SearchMode }
  | { type: "export/bundle" };

/** Maps each request `type` to the shape of its successful response data. */
export interface ResponseMap {
  "notes/list": Note[];
  "notes/get": Note | null;
  "notes/update": Note;
  "notes/delete": { id: string };
  "notes/clear": { cleared: number };
  "topics/list": Topic[];
  "capture/start": { taskId: string };
  "search/run": SearchResult[];
  "export/bundle": MiloExport;
}

/** The response type for a given request type. */
export type ResponseFor<T extends Request["type"]> = Result<ResponseMap[T]>;
