import * as React from "react";
import { PlusIcon, CalendarBlankIcon } from "@phosphor-icons/react";
import { TaskCard } from "@/components/widgets/TaskCard";
import { Button } from "@/components/elements/Button";
import { useTasks } from "@/hooks/TaskPlanner";
import { cn } from "@/utils/css";

function todayLabel(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function TaskPlanner({ id }: { id: string }) {
  const { tasks, activeTaskId, addTask, removeTask, startTask, stopTask, completeTask } =
    useTasks();
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  function handleAdd() {
    if (!input.trim()) return;
    addTask(input);
    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <section
      id={id}
      className="w-full rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
      style={{ animation: "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-semibold leading-none">Today's Focus</h2>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{todayLabel()}</p>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <CalendarBlankIcon className="size-3.5" />
            <span>
              {done}/{total}
            </span>
          </div>
        )}
      </div>

      {total > 0 && (
        <div
          id={`${id}-progress`}
          className="h-1 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div id={`${id}-list`} className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma tarefa ainda. Adicione a primeira abaixo.
          </p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={`task-card-${task.id}`}
            task={task}
            isActive={activeTaskId === task.id}
            onPlay={() => startTask(task.id)}
            onPause={stopTask}
            onComplete={() => completeTask(task.id)}
            onRemove={() => removeTask(task.id)}
          />
        ))}
      </div>

      <div id={`${id}-add`} className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar tarefa..."
          className={cn(
            "flex-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            "transition-colors"
          )}
        />
        <Button
          id={`${id}-add-btn`}
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={!input.trim()}
          aria-label="Adicionar tarefa"
        >
          <PlusIcon weight="bold" />
        </Button>
      </div>
    </section>
  );
}
