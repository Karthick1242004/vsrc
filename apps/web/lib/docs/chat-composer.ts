import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "chat-composer",
  title: "Chat Composer",
  word: "chat",
  blurb: "An AI chat block: a live message log with typing and streaming states, and a glass composer with attachments, a model picker and stop.",
  extendsRadix: null,
  props: [
    {
      component: "ChatComposer",
      rows: [
        { name: "messages", type: "ChatMessage[]", description: "Conversation to render: id, role (user or assistant), content and optional status (typing, streaming, done). You own the state." },
        { name: "onSend", type: "({ text, model, attachments }) => void", description: "Fires on Enter or the send button. Shift+Enter inserts a newline." },
        { name: "streaming", type: "boolean", default: "false", description: "Swaps send for a stop button and blocks sending." },
        { name: "onStop", type: "() => void", description: "Fires from the stop button." },
        { name: "models", type: "{ value: string; label: string }[]", default: "Lumen Fast / Lumen Pro", description: "Options for the model select." },
        { name: "model / defaultModel / onModelChange", type: "string / string / (model) => void", description: "Controlled or initial model." },
        GLASS_PROP("the composer bar"),
      ],
    },
  ],
  a11y: [
    "The message list is role=\"log\" with aria-live=\"polite\", labelled \"Conversation\", focusable so it can be scrolled by keyboard, and aria-busy while streaming so a reply is announced once rather than token by token.",
    "The textarea has a hidden label and a described hint: Enter sends, Shift+Enter adds a line; Enter is ignored during IME composition.",
    "Icon buttons are named (Attach files, Send message, Stop generating, Remove <file>); the model picker is a labelled native select.",
    "Typing dots, the streaming caret and message entrance animate only under prefers-reduced-motion: no-preference. Auto-scroll follows new text only while you are at the bottom; if you scroll up, a \"Jump to latest\" button appears instead.",
  ],
  optics: "COMPOSER_OPTICS (scale −72, chroma 3, border 0.12, mapBlur 10, blur 2): between the small-control and large-panel recipes, since the bar is a wide pill-like surface with a lit rim. Only the composer bar is glass; message bubbles are plain (assistant) or tinted (user), and the controls inside the bar are plain native elements.",
  e2e: { surface: '[data-slot="chat-composer-bar"]' },
};
