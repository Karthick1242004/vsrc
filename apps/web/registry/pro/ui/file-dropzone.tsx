"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const ZONE_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.1,
  mapBlur: 12,
  blur: 3,
  saturate: 1.3,
  fallbackBlur: 6,
};

export interface FileDropzoneProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Same syntax as the input's accept attribute: ".pdf", "image/*", "image/png". */
  accept?: string;
  /** Per-file limit in bytes. */
  maxSize?: number;
  /** Total files kept in the list. */
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Replaces the generated "types, size" hint. */
  hint?: React.ReactNode;
  onFilesChange?: (files: File[]) => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

interface Entry {
  id: string;
  file: File;
  progress: number;
}

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept.split(",").some((raw) => {
    const token = raw.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}

function describeAccept(accept?: string) {
  if (!accept) return "Any file";
  return accept
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.endsWith("/*") ? `${t.slice(0, -2)}s` : t.startsWith(".") ? t.slice(1).toUpperCase() : (t.split("/")[1] ?? t).toUpperCase()))
    .join(", ");
}

function FileDropzone({
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  hint,
  onFilesChange,
  glass,
  className,
  ref,
  ...props
}: FileDropzoneProps) {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [announce, setAnnounce] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const counter = React.useRef(0);
  const inputId = React.useId();
  const limit = multiple ? (maxFiles ?? Infinity) : 1;
  const uploading = entries.some((e) => e.progress < 100);

  // Simulated upload: progress ticks until every entry reaches 100, then the timer stops.
  React.useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setEntries((prev) => prev.map((e) => (e.progress >= 100 ? e : { ...e, progress: Math.min(100, e.progress + 4 + (e.file.size % 7)) })));
    }, 140);
    return () => clearInterval(timer);
  }, [uploading]);

  const update = (next: Entry[]) => {
    setEntries(next);
    onFilesChange?.(next.map((e) => e.file));
  };

  const add = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const problems: string[] = [];
    const ok: Entry[] = [];
    const base = multiple ? entries : [];
    for (const file of incoming) {
      if (!accepts(file, accept)) problems.push(`${file.name} is not an accepted type (${describeAccept(accept)}).`);
      else if (maxSize !== undefined && file.size > maxSize) problems.push(`${file.name} is ${formatSize(file.size)}; the limit is ${formatSize(maxSize)}.`);
      else if (base.length + ok.length >= limit) problems.push(`${file.name} was not added; at most ${limit} file${limit === 1 ? "" : "s"} allowed.`);
      else ok.push({ id: `${file.name}-${file.size}-${counter.current++}`, file, progress: 0 });
    }
    setErrors(problems);
    setAnnounce(
      [ok.length ? `Added ${ok.length} file${ok.length === 1 ? "" : "s"}: ${ok.map((e) => e.file.name).join(", ")}.` : "", problems.length ? `${problems.length} rejected. ${problems.join(" ")}` : ""]
        .filter(Boolean)
        .join(" "),
    );
    if (ok.length) update([...base, ...ok]);
  };

  const remove = (entry: Entry) => {
    setErrors([]);
    setAnnounce(`Removed ${entry.file.name}.`);
    update(entries.filter((e) => e.id !== entry.id));
    inputRef.current?.focus();
  };

  return (
    <div ref={ref} data-slot="file-dropzone-root" className={cn("flex w-full max-w-md flex-col gap-3", className)} {...props}>
      <GlassSurface asChild glass={mergeGlass(ZONE_OPTICS, glass)}>
        <label
          htmlFor={inputId}
          data-slot="file-dropzone"
          data-dragging={dragging || undefined}
          data-disabled={disabled || undefined}
          onDragEnter={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = disabled ? "none" : "copy";
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(Array.from(e.dataTransfer.files));
          }}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center gap-2 rounded-[28px] px-6 py-8 text-center",
            "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring ring-offset-background",
            "data-[dragging]:scale-[1.025] data-[dragging]:shadow-[0_0_0_2px_var(--ring)]",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 motion-reduce:transition-none motion-reduce:data-[dragging]:scale-100",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-[22px] border border-dashed border-foreground/30 transition-colors duration-300 group-data-[dragging]:border-foreground/70"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-8 transition-transform duration-300 group-data-[dragging]:-translate-y-1.5 group-data-[dragging]:scale-110 motion-reduce:transition-none"
          >
            <path d="M12 16V5m0 0-4 4m4-4 4 4M4.5 15.5V18a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
          </svg>
          <span className="text-sm font-medium">
            {dragging ? "Release to upload" : (
              <>
                Drop files here or <span className="underline underline-offset-4">browse</span>
              </>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {hint ?? `${describeAccept(accept)}${maxSize !== undefined ? ` up to ${formatSize(maxSize)}` : ""}${limit !== Infinity ? `, max ${limit} file${limit === 1 ? "" : "s"}` : ""}`}
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              add(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
      </GlassSurface>

      <div role="status" aria-live="polite" data-slot="file-dropzone-status">
        <span className="sr-only">{announce}</span>
        {errors.length > 0 && (
          <ul aria-hidden className="flex flex-col gap-1 text-sm text-foreground">
            {errors.map((msg) => (
              <li key={msg} className="flex items-start gap-2">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-signal" />
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      {entries.length > 0 && (
        <ul data-slot="file-dropzone-list" aria-label="Selected files" className="flex flex-col gap-2">
          {entries.map((entry) => {
            const done = entry.progress >= 100;
            return (
              <li
                key={entry.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-3 py-2.5 transition-[opacity,transform] duration-300 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{entry.file.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{done ? formatSize(entry.file.size) : `${entry.progress}%`}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`Upload progress for ${entry.file.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={entry.progress}
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10"
                  >
                    <div
                      className="h-full origin-left rounded-full bg-primary transition-transform duration-150 ease-linear motion-reduce:transition-none"
                      style={{ transform: `scaleX(${entry.progress / 100})`, width: "100%" }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${entry.file.name}`}
                  onClick={() => remove(entry)}
                  className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground", FOCUS)}
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden className="size-3">
                    <path d="m2 2 8 8M10 2 2 10" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { FileDropzone };
