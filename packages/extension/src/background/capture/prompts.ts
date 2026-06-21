// The prompt strings for the capture pipeline, extracted from the logic so they
// are easy to read and tweak in one place.

export const formatPrompt = (text: string): string =>
  `Format this text by wrapping code in backticks (\`inline\`) or triple backticks for blocks. ` +
  `Keep the EXACT same text; only add markdown code formatting where appropriate. ` +
  `Do not summarize or change the wording:\n\n${text}`;

export const titlePrompt = (pageTitle: string, text: string): string =>
  `Generate ONE concise technical title (max 10 words) for this note. ` +
  `Output ONLY the title, no quotes or explanation.\n\n` +
  `Page: ${pageTitle}\n\nContent: ${text.slice(0, 500)}\n\nTitle:`;

export const tagsPrompt = (text: string): string =>
  `Generate 3-5 relevant technical tags (keywords) for this note. ` +
  `Return ONLY a comma-separated list, nothing else:\n\n${text.slice(0, 500)}`;
