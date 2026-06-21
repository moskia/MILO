import type { CaptureProgress, CaptureTask } from "@milo/shared";

const STEPS: Array<[keyof CaptureProgress, string]> = [
  ["format", "Formatting"],
  ["title", "Title"],
  ["tags", "Tags"],
  ["summary", "Summary"],
];

/** Live per-step progress for a capture being processed in the background. */
export function TaskCard({ task }: { task: CaptureTask }) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
        <span className="truncate">{task.preview.title || task.pageTitle}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {STEPS.map(([key, label]) => (
          <span
            key={key}
            className={`text-xs ${task.progress[key] ? "text-indigo-700" : "text-zinc-400"}`}
          >
            {task.progress[key] ? "✓" : "○"} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
