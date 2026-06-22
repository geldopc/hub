import * as React from "react";
import {
  loadTasks,
  saveTasks,
  createTask,
  type Task,
} from "@/utils/tasks";

export function useTasks() {
  const [tasks, setTasks] = React.useState<Task[]>(() => loadTasks());
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const persist = React.useCallback((updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  React.useEffect(() => {
    if (!activeTaskId) return;
    intervalRef.current = setInterval(() => {
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === activeTaskId
            ? { ...t, elapsedSeconds: t.elapsedSeconds + 1 }
            : t
        );
        saveTasks(updated);
        return updated;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTaskId]);

  function addTask(title: string, estimatedMinutes?: number) {
    if (!title.trim()) return;
    persist([...tasks, createTask(title.trim(), estimatedMinutes)]);
  }

  function removeTask(id: string) {
    if (activeTaskId === id) stopTask();
    persist(tasks.filter((t) => t.id !== id));
  }

  function startTask(id: string) {
    if (activeTaskId && activeTaskId !== id) stopTask();
    setActiveTaskId(id);
    persist(
      tasks.map((t) =>
        t.id === id ? { ...t, status: "in_progress" } : t
      )
    );
  }

  function stopTask() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveTaskId(null);
    persist(
      tasks.map((t) =>
        t.status === "in_progress" ? { ...t, status: "todo" } : t
      )
    );
  }

  function completeTask(id: string) {
    if (activeTaskId === id) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveTaskId(null);
    }
    persist(
      tasks.map((t) => (t.id === id ? { ...t, status: "done" } : t))
    );
  }

  return { tasks, activeTaskId, addTask, removeTask, startTask, stopTask, completeTask };
}
