"use client";

import * as React from "react";

import { Button } from "@/registry/vsrc/ui/button";
import { Stepper, type StepperStep } from "@/registry/pro/ui/stepper";
import { cn } from "@/lib/utils";

const field =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

const REGIONS = ["Frankfurt (eu-central)", "Virginia (us-east)", "Singapore (ap-southeast)"];
const PLANS = [
  { id: "starter", name: "Starter", price: "$0", note: "Up to 3 members" },
  { id: "team", name: "Team", price: "$12", note: "Per member, per month" },
];

export function StepperDemo() {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [region, setRegion] = React.useState(REGIONS[0] ?? "");
  const [invites, setInvites] = React.useState("maya@northwind.studio, deb@northwind.studio");
  const [plan, setPlan] = React.useState("team");
  const [done, setDone] = React.useState(false);

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const planName = PLANS.find((p) => p.id === plan)?.name ?? "";

  const steps: StepperStep[] = [
    {
      id: "name",
      label: "Name",
      optional: "What to call it",
      canProceed: name.trim().length >= 3,
      hint: "Enter at least 3 characters",
      content: (
        <div className="flex flex-col gap-2">
          <label htmlFor="ws-name" className="text-sm font-medium">
            Workspace name
          </label>
          <input
            id="ws-name"
            className={field}
            placeholder="Northwind Studio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            {slug ? `Your URL will be vsrc.app/${slug}` : "This becomes your workspace URL."}
          </p>
        </div>
      ),
    },
    {
      id: "region",
      label: "Region",
      optional: "Where data lives",
      content: (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Data region</legend>
          {REGIONS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 text-sm">
              <input type="radio" name="region" className="size-4 accent-primary" checked={region === r} onChange={() => setRegion(r)} />
              {r}
            </label>
          ))}
        </fieldset>
      ),
    },
    {
      id: "team",
      label: "Team",
      optional: "Invite people",
      content: (
        <div className="flex flex-col gap-2">
          <label htmlFor="ws-invites" className="text-sm font-medium">
            Invite by email
          </label>
          <textarea
            id="ws-invites"
            rows={2}
            className={cn(field, "h-auto resize-none py-2")}
            value={invites}
            onChange={(e) => setInvites(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Separate addresses with commas. You can skip this.</p>
        </div>
      ),
    },
    {
      id: "plan",
      label: "Plan",
      optional: "Pick a tier",
      content: (
        <fieldset className="grid gap-2 sm:grid-cols-2">
          <legend className="sr-only">Plan</legend>
          {PLANS.map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                plan === p.id ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              <input type="radio" name="plan" className="sr-only" checked={plan === p.id} onChange={() => setPlan(p.id)} />
              <span className="text-sm font-medium">
                {p.name} <span className="text-muted-foreground">{p.price}</span>
              </span>
              <span className="text-xs text-muted-foreground">{p.note}</span>
            </label>
          ))}
        </fieldset>
      ),
    },
  ];

  if (done) {
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-3 text-center">
        <p className="font-display text-3xl">{name.trim()} is ready</p>
        <p className="text-sm text-muted-foreground">
          {planName} plan in {region}. Invitations sent to {invites.split(",").filter((s) => s.trim()).length} people.
        </p>
        <Button
          onClick={() => {
            setDone(false);
            setStep(0);
            setName("");
          }}
        >
          Start over
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <Stepper steps={steps} activeStep={step} onActiveStepChange={setStep} onComplete={() => setDone(true)} finishLabel="Create workspace" />
    </div>
  );
}
