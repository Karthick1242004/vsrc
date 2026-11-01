"use client";

import * as React from "react";

import { OtpInput } from "@/registry/pro/ui/otp-input";

const CORRECT = "428193";

export function OtpInputDemo() {
  const [code, setCode] = React.useState("");
  const [state, setState] = React.useState<"idle" | "invalid" | "verified">("idle");

  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput
        label="Verification code"
        value={code}
        invalid={state === "invalid"}
        onValueChange={(v) => {
          setCode(v);
          setState("idle");
        }}
        onComplete={(v) => setState(v === CORRECT ? "verified" : "invalid")}
        className="max-w-full"
      />
      <p role="status" className="min-h-5 text-sm text-foreground/80">
        {state === "verified" && "Code verified. Welcome back, Ines."}
        {state === "invalid" && "That code is not right. Try 428193."}
        {state === "idle" && "We sent a 6-digit code to i***@northwind.co"}
      </p>
    </div>
  );
}
