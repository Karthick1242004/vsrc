"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const COMPOSER_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.12,
  mapBlur: 10,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** "typing": waiting for the first token (dots). "streaming": tokens arriving (caret). */
  status?: "typing" | "streaming" | "done";
}
export interface ChatModel {
  value: string;
  label: string;
}
export interface ChatSendPayload {
  text: string;
  model: string;
  attachments: File[];
}

const DEFAULT_MODELS: ChatModel[] = [
  { value: "lumen-fast", label: "Lumen Fast" },
  { value: "lumen-pro", label: "Lumen Pro" },
];

const STYLE = `
@keyframes vsrc-chat-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes vsrc-chat-dot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
@keyframes vsrc-chat-caret{50%{opacity:0}}
@media (prefers-reduced-motion:no-preference){
[data-slot="chat-composer"] .vsrc-chat-in{animation:vsrc-chat-in .3s cubic-bezier(.2,.7,.2,1) both}
[data-slot="chat-composer"] .vsrc-chat-dot{animation:vsrc-chat-dot 1.1s ease-in-out infinite}
[data-slot="chat-composer"] .vsrc-chat-caret{animation:vsrc-chat-caret 1s steps(1) infinite}}`;

const ringClass = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";
const iconProps = { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, className: "size-4" } as const;

function Bubble({ message }: { message: ChatMessage }) {
  const user = message.role === "user";
  const typing = message.status === "typing";
  return (
    <li data-slot="chat-message" data-role={message.role} className={cn("vsrc-chat-in flex list-none", user ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground",
          user ? "rounded-br-md border border-primary/40 bg-primary/25" : "rounded-bl-md border border-border bg-foreground/5",
        )}
      >
        <span className="sr-only">{user ? "You: " : "Assistant: "}</span>
        {typing ? (
          <span className="inline-flex h-5 items-center gap-1" role="status">
            <span className="sr-only">Assistant is typing</span>
            {[0, 1, 2].map((i) => (
              <span key={i} aria-hidden="true" className="vsrc-chat-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </span>
        ) : (
          <>
            {message.content}
            {message.status === "streaming" ? <span aria-hidden="true" className="vsrc-chat-caret ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-foreground" /> : null}
          </>
        )}
      </div>
    </li>
  );
}

export interface ChatComposerProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  messages: ChatMessage[];
  onSend?: (payload: ChatSendPayload) => void;
  /** While true the send button becomes a stop button and sending is blocked. */
  streaming?: boolean;
  onStop?: () => void;
  models?: ChatModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  placeholder?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function ChatComposer({
  messages,
  onSend,
  streaming = false,
  onStop,
  models = DEFAULT_MODELS,
  model: modelProp,
  defaultModel,
  onModelChange,
  placeholder = "Message Lumen",
  glass,
  className,
  ...props
}: ChatComposerProps) {
  const uid = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const stick = React.useRef(true);
  const [away, setAway] = React.useState(false);
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [innerModel, setInnerModel] = React.useState(defaultModel ?? models[0]?.value ?? "");
  const model = modelProp ?? innerModel;
  const canSend = !streaming && (text.trim().length > 0 || files.length > 0);

  const toBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 56;
    setAway(!stick.current);
  };

  // Follow new content only while the reader is at the bottom; once they scroll up, leave them be.
  React.useLayoutEffect(() => {
    if (stick.current) toBottom();
    else setAway(true);
  }, [messages]);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (stick.current) toBottom();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [text]);

  const send = () => {
    if (!canSend) return;
    stick.current = true;
    setAway(false);
    onSend?.({ text: text.trim(), model, attachments: files });
    setText("");
    setFiles([]);
    textRef.current?.focus();
  };

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((prev) => {
      const key = (f: File) => `${f.name}:${f.size}`;
      const seen = new Set(prev.map(key));
      return [...prev, ...Array.from(list).filter((f) => !seen.has(key(f)))];
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div data-slot="chat-composer" className={cn("flex h-[26rem] w-full max-w-2xl flex-col gap-3", className)} {...props}>
      <style>{STYLE}</style>
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-busy={streaming}
          aria-label="Conversation"
          tabIndex={0}
          onScroll={onScroll}
          data-slot="chat-log"
          className={cn("h-full overflow-y-auto overscroll-contain rounded-2xl px-1 py-2 [mask-image:linear-gradient(to_bottom,transparent,black_14px)]", ringClass)}
        >
          <ul role="list" className="flex flex-col gap-3">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </ul>
        </div>
        {away ? (
          <button
            type="button"
            onClick={() => {
              stick.current = true;
              setAway(false);
              toBottom();
            }}
            className={cn("absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-md", ringClass)}
          >
            <svg {...iconProps} className="size-3.5">
              <path d="M10 4v12m0 0 4.5-4.5M10 16l-4.5-4.5" />
            </svg>
            Jump to latest
          </button>
        ) : null}
      </div>

      <GlassSurface asChild glass={mergeGlass(COMPOSER_OPTICS, glass)}>
        <form
          data-slot="chat-composer-bar"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="relative flex flex-col gap-2 rounded-3xl p-3 transition-[border-color] focus-within:border-foreground/40"
        >
          {files.length ? (
            <ul aria-label="Attachments" className="flex flex-wrap gap-1.5">
              {files.map((f) => (
                <li key={`${f.name}:${f.size}`} className="vsrc-chat-in flex max-w-full list-none items-center gap-1 rounded-full border border-foreground/20 bg-foreground/10 py-1 pr-1 pl-3 text-xs text-foreground">
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                    className={cn("grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-foreground/15 hover:text-foreground", ringClass)}
                  >
                    <svg {...iconProps} className="size-3">
                      <path d="m5 5 10 10M15 5 5 15" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <label htmlFor={`${uid}-text`} className="sr-only">
            Message
          </label>
          <textarea
            ref={textRef}
            id={`${uid}-text`}
            rows={1}
            value={text}
            placeholder={placeholder}
            aria-describedby={`${uid}-hint`}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            className="max-h-36 min-h-7 w-full resize-none bg-transparent px-1.5 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <p id={`${uid}-hint`} className="sr-only">
            Press Enter to send, Shift and Enter for a new line.
          </p>

          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            <button
              type="button"
              aria-label="Attach files"
              onClick={() => fileRef.current?.click()}
              className={cn("grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground", ringClass)}
            >
              <svg {...iconProps}>
                <path d="m16 9.5-6 6a3.5 3.5 0 0 1-5-5l6.5-6.5a2.3 2.3 0 0 1 3.3 3.3L8.3 13.8a1.2 1.2 0 0 1-1.7-1.7L12 6.7" />
              </svg>
            </button>
            <div className="relative min-w-0">
              <label htmlFor={`${uid}-model`} className="sr-only">
                Model
              </label>
              <select
                id={`${uid}-model`}
                value={model}
                onChange={(e) => {
                  if (modelProp === undefined) setInnerModel(e.target.value);
                  onModelChange?.(e.target.value);
                }}
                className={cn("h-9 max-w-full cursor-pointer appearance-none rounded-full border border-foreground/20 bg-foreground/10 pr-8 pl-3 text-xs font-medium text-foreground", ringClass)}
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value} className="bg-card text-foreground">
                    {m.label}
                  </option>
                ))}
              </select>
              <svg {...iconProps} className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-muted-foreground">
                <path d="m5 8 5 5 5-5" />
              </svg>
            </div>
            <span className="flex-1" />
            {streaming ? (
              <button
                type="button"
                aria-label="Stop generating"
                onClick={onStop}
                className={cn("grid size-9 shrink-0 place-items-center rounded-full border border-foreground/30 bg-foreground/10 text-foreground transition-transform hover:bg-foreground/20 active:scale-95", ringClass)}
              >
                <span aria-hidden="true" className="size-3 rounded-[3px] bg-current" />
              </button>
            ) : (
              <button
                type="submit"
                aria-label="Send message"
                disabled={!canSend}
                className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-[opacity,transform] hover:bg-primary/90 active:scale-95 disabled:pointer-events-none disabled:opacity-40", ringClass)}
              >
                <svg {...iconProps}>
                  <path d="M10 16V4m0 0-4.5 4.5M10 4l4.5 4.5" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </GlassSurface>
    </div>
  );
}

export { ChatComposer };
