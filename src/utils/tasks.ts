export interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  estimatedMinutes?: number;
  elapsedSeconds: number;
  createdAt: string;
}

const STORAGE_KEY = "hub:tasks";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: Task[] = JSON.parse(raw);
    const today = todayKey();
    return all.filter((t) => t.createdAt.startsWith(today));
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  let all: Task[] = [];
  try {
    all = raw ? JSON.parse(raw) : [];
  } catch {
    all = [];
  }
  const today = todayKey();
  const others = all.filter((t) => !t.createdAt.startsWith(today));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...others, ...tasks]));
}

export function createTask(title: string, estimatedMinutes?: number): Task {
  return {
    id: crypto.randomUUID(),
    title,
    status: "todo",
    estimatedMinutes,
    elapsedSeconds: 0,
    createdAt: new Date().toISOString(),
  };
}
