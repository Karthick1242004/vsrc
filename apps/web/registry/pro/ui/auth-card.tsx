"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CARD_OPTICS: LiquidGlassOptions = {
  scale: -88,
  chroma: 3,
  border: 0.08,
  mapBlur: 14,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 3,
};

export type AuthMode = "sign-in" | "sign-up";
export interface AuthValues {
  email: string;
  password: string;
}
export interface SocialProvider {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const DEFAULT_SOCIALS: SocialProvider[] = [
  {
    id: "orbit",
    label: "Continue with Orbit",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="size-4">
        <circle cx="10" cy="10" r="6.5" />
        <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "ember",
    label: "Continue with Ember",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className="size-4">
        <path d="M10 3.5 16 10l-6 6.5L4 10z" />
      </svg>
    ),
  },
];

const STYLE = `
@keyframes vsrc-auth-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes vsrc-auth-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:no-preference){
[data-slot="auth-card"] .vsrc-auth-in{animation:vsrc-auth-in .3s cubic-bezier(.2,.7,.2,1) both}
[data-slot="auth-card"] .vsrc-auth-spin{animation:vsrc-auth-spin .8s linear infinite}}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: AuthValues, mode: AuthMode) {
  const errors: Partial<Record<keyof AuthValues, string>> = {};
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (!values.password) errors.password = "Enter your password.";
  else if (mode === "sign-up" && values.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

const fieldClass = cn(
  "h-11 w-full min-w-0 rounded-full border border-foreground/20 bg-foreground/10 px-4 text-sm text-foreground",
  "placeholder:text-muted-foreground outline-none transition-[border-color,box-shadow]",
  "focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
  "aria-[invalid=true]:border-primary",
);
const ringClass = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

function Eye({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
      <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.25" />
      {off ? <path d="m3.5 3.5 13 13" /> : null}
    </svg>
  );
}

export interface AuthCardProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  mode?: AuthMode;
  defaultMode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  /** May return a promise; the button shows its loading state until it settles. */
  onSubmit?: (values: AuthValues, mode: AuthMode) => void | Promise<unknown>;
  /** Forces the loading state (e.g. while you own the request). */
  loading?: boolean;
  socials?: SocialProvider[];
  onSocial?: (providerId: string, mode: AuthMode) => void;
  forgotPasswordHref?: string;
  onForgotPassword?: () => void;
  termsHref?: string;
  privacyHref?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function AuthCard({
  mode: modeProp,
  defaultMode = "sign-in",
  onModeChange,
  onSubmit,
  loading,
  socials = DEFAULT_SOCIALS,
  onSocial,
  forgotPasswordHref,
  onForgotPassword,
  termsHref,
  privacyHref,
  glass,
  className,
  ref,
  ...props
}: AuthCardProps) {
  const uid = React.useId();
  const [innerMode, setInnerMode] = React.useState<AuthMode>(defaultMode);
  const mode = modeProp ?? innerMode;
  const signUp = mode === "sign-up";
  const [values, setValues] = React.useState<AuthValues>({ email: "", password: "" });
  const [errors, setErrors] = React.useState<Partial<Record<keyof AuthValues, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof AuthValues, boolean>>>({});
  const [reveal, setReveal] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const busy = loading ?? pending;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const tabRefs = React.useRef<Record<AuthMode, HTMLButtonElement | null>>({ "sign-in": null, "sign-up": null });
  const mounted = React.useRef(true);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const switchMode = (next: AuthMode, focus = false) => {
    if (next !== mode) {
      if (modeProp === undefined) setInnerMode(next);
      onModeChange?.(next);
      setErrors({});
      setTouched({});
      setReveal(false);
    }
    if (focus) tabRefs.current[next]?.focus();
  };
  const onTabKey = (e: React.KeyboardEvent) => {
    const order: AuthMode[] = ["sign-in", "sign-up"];
    const i = order.indexOf(mode);
    const next = e.key === "ArrowRight" ? order[(i + 1) % 2] : e.key === "ArrowLeft" ? order[(i + 1) % 2] : e.key === "Home" ? order[0] : e.key === "End" ? order[1] : undefined;
    if (!next) return;
    e.preventDefault();
    switchMode(next, true);
  };

  const update = (key: keyof AuthValues, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validate(next, mode)[key] }));
  };
  const blur = (key: keyof AuthValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validate(values, mode)[key] }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const found = validate(values, mode);
    setTouched({ email: true, password: true });
    setErrors(found);
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();
    try {
      const result = onSubmit?.({ email: values.email.trim(), password: values.password }, mode);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setPending(true);
        await result;
      }
    } finally {
      if (mounted.current) setPending(false);
    }
  };

  const link = (href: string | undefined, label: string) => (
    <a href={href ?? "#"} onClick={href ? undefined : (e) => e.preventDefault()} className={cn("rounded-sm text-foreground underline underline-offset-2", ringClass)}>
      {label}
    </a>
  );

  const emailErr = errors.email;
  const pwErr = errors.password;
  const tabId = (m: AuthMode) => `${uid}-tab-${m}`;

  return (
    <GlassSurface asChild glass={mergeGlass(CARD_OPTICS, glass)}>
      <div ref={ref} data-slot="auth-card" data-mode={mode} className={cn("relative w-full max-w-sm p-6 sm:p-8", className)} {...props}>
        <style>{STYLE}</style>
        <div role="tablist" aria-label="Account" className="relative grid grid-cols-2 rounded-full border border-foreground/15 bg-foreground/10 p-1" data-slot="auth-tabs">
          <span
            aria-hidden="true"
            className={cn("absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-foreground/20 transition-transform duration-300 ease-out motion-reduce:transition-none", signUp && "translate-x-full")}
          />
          {(["sign-in", "sign-up"] as const).map((m) => (
            <button
              key={m}
              ref={(el) => {
                tabRefs.current[m] = el;
              }}
              type="button"
              role="tab"
              id={tabId(m)}
              aria-selected={mode === m}
              aria-controls={`${uid}-panel`}
              tabIndex={mode === m ? 0 : -1}
              onClick={() => switchMode(m)}
              onKeyDown={onTabKey}
              className={cn("relative h-9 rounded-full text-sm font-medium transition-colors", ringClass, mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {m === "sign-in" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={tabId(mode)} key={mode} className="vsrc-auth-in mt-6">
          <h2 className="font-display text-3xl leading-tight text-foreground">{signUp ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{signUp ? "Free to start. No card needed." : "Sign in to pick up where you left off."}</p>

          <form noValidate onSubmit={submit} aria-busy={busy} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-email`} className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                ref={emailRef}
                id={`${uid}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@studio.com"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => blur("email")}
                aria-invalid={emailErr ? true : undefined}
                aria-describedby={emailErr ? `${uid}-email-err` : undefined}
                className={fieldClass}
              />
              {emailErr ? (
                <p id={`${uid}-email-err`} className="text-xs text-foreground">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" aria-hidden="true" />
                  {emailErr}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`${uid}-password`} className="text-sm font-medium text-foreground">
                  Password
                </label>
                {!signUp ? <span className="text-xs">{link(forgotPasswordHref, "Forgot password?")}</span> : null}
              </div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id={`${uid}-password`}
                  type={reveal ? "text" : "password"}
                  autoComplete={signUp ? "new-password" : "current-password"}
                  placeholder={signUp ? "At least 8 characters" : "Your password"}
                  value={values.password}
                  onChange={(e) => update("password", e.target.value)}
                  onBlur={() => blur("password")}
                  aria-invalid={pwErr ? true : undefined}
                  aria-describedby={pwErr ? `${uid}-pw-err` : signUp ? `${uid}-pw-hint` : undefined}
                  className={cn(fieldClass, "pr-12")}
                />
                <button
                  type="button"
                  aria-label="Show password"
                  aria-pressed={reveal}
                  onClick={() => setReveal((r) => !r)}
                  className={cn("absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground", ringClass)}
                >
                  <Eye off={reveal} />
                </button>
              </div>
              {pwErr ? (
                <p id={`${uid}-pw-err`} className="text-xs text-foreground">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" aria-hidden="true" />
                  {pwErr}
                </p>
              ) : signUp ? (
                <p id={`${uid}-pw-hint`} className="text-xs text-muted-foreground">
                  Use at least 8 characters.
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              aria-disabled={busy}
              className={cn(
                "mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-200 active:scale-[0.98] hover:bg-primary/90 aria-disabled:cursor-progress aria-disabled:opacity-80",
                ringClass,
              )}
            >
              {busy ? (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="vsrc-auth-spin size-4">
                  <path d="M10 3a7 7 0 1 0 7 7" />
                </svg>
              ) : null}
              {busy ? (signUp ? "Creating account…" : "Signing in…") : signUp ? "Create account" : "Sign in"}
            </button>
            <span role="status" className="sr-only">
              {busy ? (signUp ? "Creating your account" : "Signing in") : ""}
            </span>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground" role="separator" aria-label="or">
            <span className="h-px flex-1 bg-foreground/20" aria-hidden="true" />
            or
            <span className="h-px flex-1 bg-foreground/20" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-2.5">
            {socials.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSocial?.(s.id, mode)}
                className={cn("inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-foreground/25 bg-foreground/10 px-5 text-sm font-medium text-foreground transition-[background-color,transform] duration-200 hover:bg-foreground/20 active:scale-[0.98]", ringClass)}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {signUp ? (
            <p className="mt-5 text-xs text-pretty text-muted-foreground">
              By creating an account you agree to the {link(termsHref, "Terms")} and {link(privacyHref, "Privacy Policy")}.
            </p>
          ) : null}
        </div>
      </div>
    </GlassSurface>
  );
}

export { AuthCard };
