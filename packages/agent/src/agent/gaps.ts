// "What am I missing?" — the gaps feature.
// IMPORTANT: unlike summary/chat (grounded ONLY in your notes), gaps deliberately
// uses the model's general knowledge to spot what's MISSING from your notes. That
// makes it more of a helpful hint than a guaranteed-correct answer.

import type { Note } from "@milo/shared";
import { geminiTextGenerator } from "../ai/gemini-text";

export async function findGaps(subject: string, notes: Note[]): Promise<string> {
  const context = notes
    .slice(0, 8)
    .map((note) => note.summary || note.content)
    .join("\n\n");

  const prompt =
    `I'm studying "${subject}". Here are the notes I've taken so far:\n\n${context}\n\n` +
    `Using general knowledge of ${subject}, list the important sub-topics or concepts my ` +
    `notes DON'T cover yet — what should I learn next? Give a short bulleted list.`;

  return geminiTextGenerator.complete(prompt);
}
