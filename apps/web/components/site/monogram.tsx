import { cn } from "@/lib/utils";

/**
 * The V-/Src monogram (mark C from the brand board): dash + slash sharing a
 * terminal. Mark hygiene: never distorted, never behind glass, single color.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("size-5", className)}>
      <path d="M22 50 H55" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
      <path d="M46 76 L80 24" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
    </svg>
  );
}

/** The docked-nav tile from the board: cream mark on the red app tile. */
export function MonogramTile({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-[22%] bg-primary text-primary-foreground",
        className,
      )}
    >
      <Monogram className="size-5" />
    </span>
  );
}
