"use client";

import * as React from "react";

import { ChatComposer, type ChatMessage, type ChatSendPayload } from "@/registry/pro/ui/chat-composer";

const SEED: ChatMessage[] = [
  { id: "m1", role: "user", content: "Can you outline a launch checklist for the new pricing page?", status: "done" },
  {
    id: "m2",
    role: "assistant",
    content: "Sure. Start with the numbers: confirm the three plans and the yearly saving, then check the copy against the billing system before anything else.",
    status: "done",
  },
];

const REPLIES = [
  "Here is a short checklist. First, freeze the plan names and prices so design and billing agree. Second, test the monthly and yearly toggle with a screen reader. Third, wire each button to checkout and confirm the interval is passed through. Last, ship behind a flag and watch conversion for a week.",
  "Good question. Keep the recommended plan visually raised but never rely on colour alone, and say \"Most popular\" in text. Put the saving next to the yearly price so nobody has to do the arithmetic.",
  "I would cut the feature lists to four lines each. People compare plans by what is different, so lead with the limit that changes, such as seats or projects, and group the rest.",
];

export function ChatComposerDemo() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(SEED);
  const [streaming, setStreaming] = React.useState(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const turn = React.useRef(0);

  const clear = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  React.useEffect(() => clear, [clear]);

  const patch = (id: string, change: Partial<ChatMessage>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...change } : m)));

  const onSend = ({ text, attachments }: ChatSendPayload) => {
    const n = ++turn.current;
    const id = `a${n}`;
    const tokens = (REPLIES[(n - 1) % REPLIES.length] ?? "").split(/(?<=\s)/);
    const note = attachments.length ? `\n(${attachments.length} attachment${attachments.length > 1 ? "s" : ""})` : "";
    setMessages((prev) => [
      ...prev,
      { id: `u${n}`, role: "user", content: text + note, status: "done" },
      { id, role: "assistant", content: "", status: "typing" },
    ]);
    setStreaming(true);
    let shown = "";
    tokens.forEach((token, i) => {
      timers.current.push(
        setTimeout(() => {
          shown += token;
          patch(id, { content: shown, status: i === tokens.length - 1 ? "done" : "streaming" });
          if (i === tokens.length - 1) setStreaming(false);
        }, 900 + i * 55),
      );
    });
  };

  const onStop = () => {
    clear();
    setStreaming(false);
    setMessages((prev) => prev.map((m) => (m.status === "typing" || m.status === "streaming" ? { ...m, content: m.content || "Stopped.", status: "done" } : m)));
  };

  return <ChatComposer messages={messages} streaming={streaming} onSend={onSend} onStop={onStop} className="max-w-xl" />;
}
