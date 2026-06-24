// The single message switchboard. One `onMessage` listener, one typed `switch`.
// Replaces MindStack's ~600-line chain of `if (action === ...)` blocks with `any`
// payloads and manual `return true`. The async/`return true` handshake lives in
// exactly one place (the adapter at the bottom).

import type { Request, Result } from "@milo/shared";
import { err, ok } from "@milo/shared";
import { CURRENT_EXPORT_VERSION } from "@milo/shared";
import { NoteRepository } from "./storage/notes";
import { startCapture } from "./capture/pipeline";
import { listTasks } from "./capture/tasks";
import { keywordSearch } from "./search/keyword";
import { semanticSearch } from "./search/semantic";
import { broadcast } from "./events";

async function handle(request: Request): Promise<Result<unknown>> {
  switch (request.type) {
    case "notes/list":
      return ok(await NoteRepository.list());

    case "notes/get":
      return ok(await NoteRepository.get(request.id));

    case "notes/update": {
      const updated = await NoteRepository.update(request.id, request.patch);
      if (!updated) return err(`Note ${request.id} not found`);
      broadcast({ type: "notes/changed" });
      return ok(updated);
    }

    case "notes/delete":
      await NoteRepository.delete(request.id);
      broadcast({ type: "notes/changed" });
      return ok({ id: request.id });

    case "notes/clear": {
      const cleared = await NoteRepository.clear();
      broadcast({ type: "notes/changed" });
      return ok({ cleared });
    }

    case "topics/list":
      // Topics arrive with the agent in Step 4.
      return ok([]);

    case "capture/start":
      return ok({ taskId: startCapture(request.input) });

    case "tasks/list":
      return ok(listTasks());

    case "search/run": {
      const notes = await NoteRepository.list();
      const results =
        request.mode === "semantic"
          ? await semanticSearch(request.query, notes)
          : keywordSearch(request.query, notes);
      return ok(results);
    }

    case "export/bundle": {
      const notes = await NoteRepository.list();
      return ok({
        version: CURRENT_EXPORT_VERSION,
        exportedAt: Date.now(),
        topics: [],
        notes,
      });
    }

    default:
      return assertNever(request);
  }
}

/** Exhaustiveness guard: if a Request variant is unhandled, this fails to compile. */
function assertNever(request: never): never {
  throw new Error(`Unhandled request: ${JSON.stringify(request)}`);
}

const REQUEST_TYPES = new Set<Request["type"]>([
  "notes/list",
  "notes/get",
  "notes/update",
  "notes/delete",
  "notes/clear",
  "topics/list",
  "capture/start",
  "tasks/list",
  "search/run",
  "export/bundle",
]);

function isRequest(message: unknown): message is Request {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    REQUEST_TYPES.has((message as { type: Request["type"] }).type)
  );
}

export function registerRouter(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isRequest(message)) return false; // ignore broadcasts / foreign messages

    handle(message)
      .then(sendResponse)
      .catch((error: unknown) => {
        sendResponse(err(error instanceof Error ? error.message : String(error)));
      });

    return true; // keep the channel open for the async response
  });
}
