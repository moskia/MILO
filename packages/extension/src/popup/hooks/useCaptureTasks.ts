import { useEffect, useState } from "react";
import type { CaptureTask } from "@milo/shared";
import { onEvent, sendRequest } from "../../lib/messaging";

/** Tracks captures currently being processed, updated live by background events. */
export function useCaptureTasks(): CaptureTask[] {
  const [tasks, setTasks] = useState<CaptureTask[]>([]);

  useEffect(() => {
    let active = true;

    // Pick up any captures already in flight when the popup opens.
    void sendRequest({ type: "tasks/list" }).then((response) => {
      if (active && response.ok) setTasks(response.data);
    });

    const off = onEvent((event) => {
      if (event.type === "task/update") {
        setTasks((prev) => [event.task, ...prev.filter((t) => t.id !== event.task.id)]);
      } else if (event.type === "task/complete" || event.type === "task/error") {
        setTasks((prev) => prev.filter((t) => t.id !== event.taskId));
      }
    });

    return () => {
      active = false;
      off();
    };
  }, []);

  return tasks;
}
