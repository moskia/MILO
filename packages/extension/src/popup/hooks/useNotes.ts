import { useCallback, useEffect, useState } from "react";
import type { Note } from "@milo/shared";
import { onEvent, sendRequest } from "../../lib/messaging";

/** Loads notes and keeps them in sync with background changes. */
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const response = await sendRequest({ type: "notes/list" });
    if (response.ok) setNotes(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
    return onEvent((event) => {
      if (event.type === "notes/changed" || event.type === "task/complete") {
        void reload();
      }
    });
  }, [reload]);

  return { notes, loading, reload };
}
