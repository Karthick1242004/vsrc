import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "auth-card",
  title: "Auth Card",
  word: "welcome",
  blurb: "A sign-in and sign-up card with a segmented mode switch, inline validation, a password reveal and a loading submit.",
  extendsRadix: null,
  props: [
    {
      component: "AuthCard",
      rows: [
        { name: "mode / defaultMode", type: '"sign-in" | "sign-up"', default: '"sign-in"', description: "Controlled or initial mode." },
        { name: "onModeChange", type: "(mode) => void", description: "Fires when the segmented switch changes mode." },
        { name: "onSubmit", type: "(values: { email, password }, mode) => void | Promise", description: "Called after client validation passes. The form never posts anywhere itself; return a promise to keep the loading state until it settles." },
        { name: "loading", type: "boolean", description: "Forces the loading state; overrides the pending state derived from onSubmit." },
        { name: "socials / onSocial", type: "SocialProvider[] / (id, mode) => void", description: "The two secondary buttons (id, label, icon) and their handler." },
        { name: "forgotPasswordHref / onForgotPassword", type: "string / () => void", description: "Target and handler for the forgot-password link shown in sign-in mode." },
        { name: "termsHref / privacyHref", type: "string", description: "Links in the sign-up terms line." },
        GLASS_PROP("the card"),
      ],
    },
  ],
  a11y: [
    "The mode switch is a tablist: Arrow keys, Home and End move and select, only the active tab is in the Tab order, and it controls a labelled tabpanel.",
    "Fields have visible labels; invalid fields set aria-invalid and aria-describedby pointing at their message, and a failed submit moves focus to the first invalid field.",
    "The show-password button is named \"Show password\" and exposes aria-pressed; the submit button uses aria-disabled while loading so it keeps focus, and a status region announces the pending state.",
    "The loading spinner rotation runs only under prefers-reduced-motion: no-preference; the mode indicator slide and panel fade are also dropped.",
  ],
  optics: "CARD_OPTICS (scale −88, chroma 3, border 0.08, mapBlur 14, blur 0.5): the large-panel recipe, soft enough to keep form text crisp. The card is the only glass surface; inputs and buttons are plain tinted native elements so no glass is nested.",
  e2e: { surface: '[data-slot="auth-card"]' },
};
