"use client";

import * as React from "react";

import { AuthCard, type AuthMode } from "@/registry/pro/ui/auth-card";

export function AuthCardDemo() {
  const [mode, setMode] = React.useState<AuthMode>("sign-in");
  const [note, setNote] = React.useState("Try an empty submit, or a short password on Sign up.");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <AuthCard
        mode={mode}
        onModeChange={setMode}
        onSubmit={(values, m) =>
          new Promise<void>((resolve) => {
            timer.current = setTimeout(() => {
              setNote(`${m === "sign-up" ? "Account created" : "Signed in"} as ${values.email} (demo only, nothing was sent).`);
              resolve();
            }, 1400);
          })
        }
        onSocial={(id) => setNote(`Social button "${id}" pressed (demo only).`)}
      />
      <p role="status" className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {note}
      </p>
    </div>
  );
}
