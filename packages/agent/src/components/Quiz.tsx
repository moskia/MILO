import { useState } from "react";
import type { Note } from "@milo/shared";
import { makeQuiz, type QuizItem } from "../agent/quiz";

export function Quiz({ subject, notes }: { subject: string; notes: Note[] }) {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    try {
      setQuestions(await makeQuiz(subject, notes));
      setIndex(0);
      setRevealed(false);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const current = questions[index];

  return (
    <div className="mt-6">
      <button
        onClick={onGenerate}
        disabled={loading}
        className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
      >
        {loading ? "Making quiz…" : "Quiz me"}
      </button>

      {current && (
        <div className="mt-3 rounded-lg border border-zinc-200 p-4">
          <div className="text-xs text-zinc-400">
            Question {index + 1} of {questions.length}
          </div>
          <p className="mt-1 font-medium text-zinc-800">{current.q}</p>

          {revealed ? (
            <p className="mt-2 text-sm text-zinc-600">{current.a}</p>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-2 text-sm font-medium text-indigo-600 hover:underline"
            >
              Reveal answer
            </button>
          )}

          {revealed && index < questions.length - 1 && (
            <button
              onClick={() => {
                setIndex((i) => i + 1);
                setRevealed(false);
              }}
              className="mt-3 block rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Next
            </button>
          )}

          {revealed && index === questions.length - 1 && (
            <p className="mt-3 text-sm text-zinc-400">That's the last one 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
