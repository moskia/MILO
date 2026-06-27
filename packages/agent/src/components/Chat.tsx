import { useState } from "react";
import type { Note } from "@milo/shared";
import { answer } from "../agent/chat";

interface Message {
  question: string;
  text: string;
  used: Note[];
}

export function Chat({ notes }: { notes: Note[] }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);

  const onSend = async () => {
    const q = question.trim();
    if (!q || thinking) return;
    setQuestion("");
    setThinking(true);
    try {
      const res = await answer(q, notes);
      setMessages((prev) => [...prev, { question: q, text: res.text, used: res.used }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { question: q, text: "Something went wrong. Is Chrome's built-in AI enabled?", used: [] },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="mt-8 border-t border-zinc-200 pt-4">
      <h2 className="mb-3 text-lg font-semibold text-zinc-800">Ask your notes</h2>

      <div className="space-y-3">
        {messages.map((message, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-zinc-800">You: {message.question}</p>
            <div className="mt-1 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
              {message.text}
              {message.used.length > 0 && (
                <div className="mt-2 text-xs text-zinc-400">
                  From: {message.used.map((note) => note.title).join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && <p className="text-sm text-zinc-500">Thinking…</p>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onSend();
          }}
          placeholder="Ask a question about your notes…"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        />
        <button
          onClick={onSend}
          disabled={thinking}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
