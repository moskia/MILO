// The bridge between the two apps. The extension exports this bundle (a download
// or local sync); the agent imports it. Versioned so the format can evolve.

import type { Note, Topic } from "./domain";

export interface MiloExport {
  version: 1;
  exportedAt: number;
  topics: Topic[];
  notes: Note[];
}

export const CURRENT_EXPORT_VERSION = 1 as const;
