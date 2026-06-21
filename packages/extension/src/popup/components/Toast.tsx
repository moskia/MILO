import { useEffect } from "react";

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(id);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
