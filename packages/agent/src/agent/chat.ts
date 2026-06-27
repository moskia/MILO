// Q&A grounded in your notes. Same RAG idea as the summary, but per-question:
// retrieve the notes most relevant to the question, then ask the model to answer
// using ONLY those notes (and cite which ones).

import type { Note } from "@milo/shared";
import { geminiTextGenerator } from "../ai/gemini-text";
import { semanticRetrieve } from "../lib/retrieve";

export async function answer(
  question: string,
  notes: Note[],
): Promise<{ text: string; used: Note[] }> {
  const used = (await semanticRetrieve(question, notes)).slice(0, 6);
  const context = used
    .map((note, i) => `[${i + 1}] ${note.title}: ${note.summary || note.content}`)
    .join("\n\n");

  const prompt =
    `Answer the question using ONLY these notes. If they don't contain the answer, ` +
    `say "I don't have notes on that." Cite the note numbers you used.\n\n` +
    `Notes:\n${context}\n\nQuestion: ${question}`;

  const text = await geminiTextGenerator.complete(prompt);
  return { text, used };
}
