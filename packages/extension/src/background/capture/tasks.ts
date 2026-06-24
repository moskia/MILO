// In-memory registry of captures currently being processed, plus the broadcasts
// that drive the popup's live progress UI. Tasks are ephemeral — they live only
// while the service worker is awake and are removed once saved.

import type { CaptureTask } from "@milo/shared";
import { broadcast } from "../events";

const tasks = new Map<string, CaptureTask>();

export function createTask(id: string, pageTitle: string): CaptureTask {
  const task: CaptureTask = {
    id,
    status: "processing",
    progress: { format: false, title: false, tags: false, summary: false, indexing: false },
    pageTitle,
    startedAt: Date.now(),
    preview: { title: "", summary: "", tags: [] },
  };
  tasks.set(id, task);
  broadcast({ type: "task/update", task });
  return task;
}

/** Persist the latest state of a task and notify the UI. */
export function updateTask(task: CaptureTask): void {
  tasks.set(task.id, task);
  broadcast({ type: "task/update", task });
}

export function completeTask(id: string, title: string): void {
  tasks.delete(id);
  broadcast({ type: "task/complete", taskId: id, title });
}

export function failTask(id: string): void {
  const task = tasks.get(id);
  if (task) task.status = "error";
  tasks.delete(id);
  broadcast({ type: "task/error", taskId: id });
}

export function listTasks(): CaptureTask[] {
  return [...tasks.values()];
}
