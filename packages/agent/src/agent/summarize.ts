// "What have I learned about X?" — the first feature that uses the LLM.
// This is RAG: we feed the *retrieved* notes to the model and ask it to
// synthesize them, so the answer is grounded in your own notes.

import type { Note } from "@milo/shared";
import { geminiTextGenerator } from "../ai/gemini-text";

export async function summarizeLearning(subject: string, notes: Note[]): Promise<string> {
  const context = notes
    .slice(0, 8)
    .map((note, i) => `${i + 1}. ${note.title}\n${note.summary || note.content}`)
    .join("\n\n");

  const prompt =
    `Here are my notes about "${subject}":\n\n${context}\n\n` +
    `In simple terms, summarize what I've learned about ${subject} and how the ideas ` +
    `connect. Use short paragraphs.`;

  return geminiTextGenerator.complete(prompt);
}
