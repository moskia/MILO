// Generate quiz questions from your notes. Same RAG idea again: feed the notes
// to the model, but this time ask for question/answer pairs in a strict format
// so we can parse the text into a list.

import type { Note } from "@milo/shared";
import { geminiTextGenerator } from "../ai/gemini-text";

export interface QuizItem {
  q: string;
  a: string;
}

export async function makeQuiz(subject: string, notes: Note[]): Promise<QuizItem[]> {
  const context = notes
    .slice(0, 8)
    .map((note) => note.summary || note.content)
    .join("\n\n");

  const prompt =
    `From these notes about "${subject}", write 5 quiz questions with answers. ` +
    `Put each on its own line, formatted EXACTLY as:  Q: <question> | A: <answer>\n\n` +
    `Notes:\n${context}`;

  const raw = await geminiTextGenerator.complete(prompt);

  // Parse "Q: ... | A: ..." lines into objects, ignoring anything that doesn't match.
  return raw
    .split("\n")
    .map((line) => line.match(/Q:(.*)\|\s*A:(.*)/i))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => ({ q: (match[1] ?? "").trim(), a: (match[2] ?? "").trim() }));
}
