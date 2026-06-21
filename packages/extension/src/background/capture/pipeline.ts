// The capture pipeline: enrich raw selected text into a Note, step by step,
// then save it. Each AI step is best-effort — a failure is logged and skipped so
// it never blocks the save (resilient by design). Progress is broadcast after
// every step to drive the popup's live checklist.

import type { CaptureInput, CaptureTask, Note } from "@milo/shared";
import { NoteRepository } from "../storage/notes";
import { geminiTextGenerator } from "../ai/gemini-text";
import { geminiSummarizer } from "../ai/gemini-summary";
import { startKeepAlive, stopKeepAlive } from "../keepalive";
import { broadcast } from "../events";
import { completeTask, createTask, failTask, updateTask } from "./tasks";
import { formatPrompt, tagsPrompt, titlePrompt } from "./prompts";

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Kicks off a capture and returns its task id immediately; runs in background. */
export function startCapture(input: CaptureInput): string {
  const task = createTask(newId(), input.source.pageTitle);
  void run(task, input);
  return task.id;
}

async function run(task: CaptureTask, input: CaptureInput): Promise<void> {
  startKeepAlive();
  try {
    // 1. Format — wrap code in backticks (falls back to raw text).
    let content = input.selectedText;
    try {
      content = await geminiTextGenerator.complete(formatPrompt(input.selectedText));
    } catch (error) {
      console.warn("[MILO] format step skipped:", error);
    }
    task.progress.format = true;
    updateTask(task);

    // 2. Title.
    let title = "";
    try {
      title = firstLine(
        await geminiTextGenerator.complete(titlePrompt(input.source.pageTitle, input.selectedText)),
      );
    } catch (error) {
      console.warn("[MILO] title step skipped:", error);
    }
    task.progress.title = true;
    task.preview = { ...task.preview, title };
    updateTask(task);

    // 3. Tags.
    let tags: string[] = [];
    try {
      tags = parseTags(await geminiTextGenerator.complete(tagsPrompt(input.selectedText)));
    } catch (error) {
      console.warn("[MILO] tags step skipped:", error);
    }
    task.progress.tags = true;
    task.preview = { ...task.preview, tags };
    updateTask(task);

    // 4. Summary.
    let summary = "";
    try {
      summary = await geminiSummarizer.summarize(input.selectedText);
    } catch (error) {
      console.warn("[MILO] summary step skipped:", error);
    }
    task.progress.summary = true;
    task.preview = { ...task.preview, summary };
    updateTask(task);

    // Save. Embedding is left null for Step 3 (semantic search) to backfill.
    const now = Date.now();
    const note: Note = {
      id: newId(),
      topicId: input.topicId,
      title: title || input.source.pageTitle || "Untitled note",
      content,
      summary,
      tags,
      source: input.source,
      userNotes: "",
      embedding: null,
      embeddingModel: null,
      createdAt: now,
      updatedAt: now,
    };
    await NoteRepository.save(note);

    broadcast({ type: "notes/changed" });
    completeTask(task.id, note.title);
  } catch (error) {
    console.error("[MILO] capture failed:", error);
    failTask(task.id);
  } finally {
    stopKeepAlive();
  }
}

function firstLine(text: string): string {
  const stripped = text.trim().replace(/^["']|["']$/g, "");
  return stripped.split("\n")[0]?.trim() ?? "";
}

function parseTags(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
