import * as React from "react";
import { PlayIcon, PauseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/elements/Button";
import { cn } from "@/utils/css";

interface PlayButtonProps {
  id: string;
  active: boolean;
  disabled?: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function PlayButton({ id, active, disabled, onPlay, onPause }: PlayButtonProps) {
  return (
    <div id={id} className="relative flex items-center justify-center">
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping"
        />
      )}
      <Button
        id={`${id}-btn`}
        size="icon-sm"
        variant={active ? "default" : "outline"}
        disabled={disabled}
        onClick={active ? onPause : onPlay}
        aria-label={active ? "Pausar tarefa" : "Iniciar tarefa"}
        className={cn("relative z-10 rounded-full", active && "shadow-sm")}
      >
        {active ? (
          <PauseIcon weight="fill" className="size-3.5" />
        ) : (
          <PlayIcon weight="fill" className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
