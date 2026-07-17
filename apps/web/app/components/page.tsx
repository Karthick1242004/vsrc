"use client";

import * as React from "react";

import { CodeBlock } from "@/components/site/code-block";
import { COMPONENT_INDEX } from "@/components/site/component-index";
import { Monogram } from "@/components/site/monogram";
import { RefractionField } from "@/components/site/refraction-field";
import { Reveal } from "@/components/site/reveal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/vsrc/ui/alert-dialog";
import { Button } from "@/registry/vsrc/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/vsrc/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/vsrc/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/registry/vsrc/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/vsrc/ui/dialog";
import { Dock, DockItem, DockSeparator } from "@/registry/vsrc/ui/dock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/vsrc/ui/dropdown-menu";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/vsrc/ui/hover-card";
import { Input } from "@/registry/vsrc/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/vsrc/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/vsrc/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/vsrc/ui/sheet";
import { Slider } from "@/registry/vsrc/ui/slider";
import { Switch } from "@/registry/vsrc/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/vsrc/ui/tabs";
import { toast } from "@/registry/vsrc/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/vsrc/ui/tooltip";
import { cn } from "@/lib/utils";

const REGISTRY_SNIPPET = `{
  "registries": {
    "@vsrc": "https://vsrc.vercel.app/r/{name}.json"
  }
}`;

const USAGE_SNIPPET = `import { Button } from "@/components/ui/button"

<Button variant="primary">Ship it</Button>
<Button>Clear glass</Button>
<Button variant="ghost">Quiet</Button>`;

const SECTIONS: { id: string; title: string; word: string; blurb: string }[] = [
  { id: "glass-surface", title: "Glass Surface", word: "primitive", blurb: "The refraction primitive every other component builds on." },
  { id: "button", title: "Button", word: "press", blurb: "Clear glass by default, one red primary per view, ghost for quiet chrome." },
  { id: "card", title: "Card", word: "panel", blurb: "A glass panel with the usual card anatomy." },
  { id: "input", title: "Input", word: "type here", blurb: "A glass field. The backdrop stays legible behind your text." },
  { id: "select", title: "Select", word: "pick one", blurb: "A glass trigger and a floating glass panel, Radix typeahead intact." },
  { id: "switch", title: "Switch", word: "on / off", blurb: "Glass track, cream thumb, red when checked." },
  { id: "slider", title: "Slider", word: "0 — 100", blurb: "A glass lens for a thumb; the rim bends the track as it slides. The switch, inverted." },
  { id: "tabs", title: "Tabs", word: "sections", blurb: "A glass pill list with quiet triggers." },
  { id: "tooltip", title: "Tooltip", word: "hover", blurb: "A small glass pill on hover or focus." },
  { id: "popover", title: "Popover", word: "anchored", blurb: "Anchored glass panel for small forms and detail." },
  { id: "hover-card", title: "Hover Card", word: "peek", blurb: "A glass preview that opens on hover or focus." },
  { id: "dropdown-menu", title: "Dropdown Menu", word: "choose", blurb: "Glass menu with Radix keyboard navigation." },
  { id: "context-menu", title: "Context Menu", word: "right-click", blurb: "A glass menu anchored to the pointer on right-click." },
  { id: "dialog", title: "Dialog", word: "modal", blurb: "A modal glass pane over a dimmed page." },
  { id: "alert-dialog", title: "Alert Dialog", word: "confirm", blurb: "A modal that forces a choice: cancel, or one confirming action." },
  { id: "sheet", title: "Sheet", word: "slide", blurb: "A side panel of glass; softer optics keep big maps cheap." },
  { id: "command", title: "Command", word: "⌘K", blurb: "cmdk in a glass panel. Press ⌘K anywhere on this site — the palette below is the same registry component." },
  { id: "toast", title: "Toast", word: "notify", blurb: "Glass-styled sonner. Toasts move constantly, so they skip the displacement engine by design." },
  { id: "dock", title: "Dock", word: "navigate", blurb: "The signature piece — the brand board's docked nav, in glass." },
];

/* The command palette needs open state, so it's a component rather than inline
   JSX. The site-wide ⌘K palette is separately live from layout.tsx. */
function CommandDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="// components">
            <CommandItem value="glass-surface">glass-surface</CommandItem>
            <CommandItem value="dialog">dialog</CommandItem>
            <CommandItem value="slider">slider</CommandItem>
            <CommandItem value="dock">dock</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

/* One demo per component, shared by the sections below and the playground —
   a surface must be roomy enough to hold clear content in the middle while
   the rim does the bending. */
const DEMOS: Record<string, React.ReactNode> = {
  "glass-surface": (
    <GlassSurface specular="pointer" className="w-[24rem] max-w-full p-8">
      <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
        {"// glass-surface"}
      </p>
      <p className="mt-3 font-display text-2xl leading-snug">Everything bends at the rim.</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Content stays legible in the middle; the edge does the optics.
      </p>
    </GlassSurface>
  ),
  button: (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="lg">Large</Button>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button size="sm">Small</Button>
    </div>
  ),
  card: (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Refraction, shipped</CardTitle>
        <CardDescription>Displacement maps, not blur stacks.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        The rim bends whatever drifts behind this panel.
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="primary">
          Get started
        </Button>
      </CardFooter>
    </Card>
  ),
  input: <Input placeholder="hello@vsrc.dev" className="w-64" aria-label="Email" />,
  select: (
    <Select defaultValue="regular">
      <SelectTrigger className="w-56" aria-label="Optics preset">
        <SelectValue placeholder="Choose optics" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{"// optics"}</SelectLabel>
          <SelectItem value="subtle">Subtle</SelectItem>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="heavy">Heavy</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  switch: (
    <div className="flex items-center gap-3">
      <Switch defaultChecked aria-label="Demo switch" />
    </div>
  ),
  slider: <Slider defaultValue={[40]} className="w-72" aria-label="Demo slider" />,
  tabs: (
    <Tabs defaultValue="optics" className="items-center">
      <TabsList>
        <TabsTrigger value="optics">Optics</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="a11y">A11y</TabsTrigger>
      </TabsList>
      <TabsContent value="optics" className="text-sm text-muted-foreground">
        Three staggered displacement passes.
      </TabsContent>
      <TabsContent value="tokens" className="text-sm text-muted-foreground">
        Everything themable via --glass-*.
      </TabsContent>
      <TabsContent value="a11y" className="text-sm text-muted-foreground">
        Radix keyboard behavior, untouched.
      </TabsContent>
    </Tabs>
  ),
  tooltip: (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Real refraction, even here</TooltipContent>
    </Tooltip>
  ),
  popover: (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-display text-lg">Subscribe</p>
        <p className="mt-1 text-sm text-muted-foreground">Release notes, no noise.</p>
        <Input placeholder="you@work.dev" className="mt-3" aria-label="Email" />
      </PopoverContent>
    </Popover>
  ),
  "hover-card": (
    <HoverCard openDelay={80}>
      <HoverCardTrigger className="cursor-default font-display text-2xl underline decoration-signal/60 underline-offset-4">
        @vsrc
      </HoverCardTrigger>
      <HoverCardContent glass="subtle">
        <p className="font-display text-lg">V-/Src</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Real refraction for the web — displacement maps, not blur stacks.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
  "dropdown-menu": (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{"// project"}</DropdownMenuLabel>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-signal">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "context-menu": (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-64 items-center justify-center rounded-[24px] border border-dashed border-border text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{"// layer"}</ContextMenuLabel>
        <ContextMenuItem>Bring forward</ContextMenuItem>
        <ContextMenuItem>Send back</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-signal">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  dialog: (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ship it?</DialogTitle>
          <DialogDescription>
            The registry is static JSON — publishing is just a deploy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Ship</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "alert-dialog": (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the registry and every deploy. It cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="primary">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  sheet: (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Everything here is a registry component.</SheetDescription>
        </SheetHeader>
        <label className="flex items-center justify-between text-sm">
          Reduce transparency
          <Switch aria-label="Reduce transparency" />
        </label>
        <Input placeholder="Display name" aria-label="Display name" />
      </SheetContent>
    </Sheet>
  ),
  command: <CommandDemo />,
  toast: (
    <Button onClick={() => toast("Copied install command", { description: "npx shadcn add @vsrc/toast" })}>
      Fire a toast
    </Button>
  ),
  dock: (
    <Dock glass={{ scale: -48 }} className="static! bottom-auto left-auto z-0 translate-x-0">
      <DockItem>
        <a href="#dock" aria-label="Home" className="bg-primary text-primary-foreground">
          <Monogram />
        </a>
      </DockItem>
      <DockItem>
        <a href="#dock" aria-label="Search">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="9" r="5.5" />
            <path d="m13.5 13.5 3.5 3.5" />
          </svg>
        </a>
      </DockItem>
      <DockSeparator />
      <DockItem>
        <a href="#dock" aria-label="Settings">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="2.5" />
            <path d="M10 3v2.2M10 14.8V17M3 10h2.2M14.8 10H17M5 5l1.6 1.6M13.4 13.4 15 15M15 5l-1.6 1.6M6.6 13.4 5 15" />
          </svg>
        </a>
      </DockItem>
    </Dock>
  ),
};

/* Every demo floats over type and warm color so the glass has something to
   bend — same reason the landing demo band exists. */
function DemoTile({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[32px] border border-border p-10">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-1/3 -left-1/4 size-80 rounded-full bg-signal/40 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/3 size-72 rounded-full bg-primary/35 blur-3xl" />
        <p className="animate-word-drift absolute top-1/2 left-1/2 -translate-1/2 font-display text-[6rem] leading-none whitespace-nowrap text-foreground/80 italic">
          {word}
        </p>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Section({
  id,
  title,
  blurb,
  word,
  children,
}: {
  id: string;
  title: string;
  blurb: string;
  word: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{`// ${id}`}</p>
        <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{blurb}</p>
        <div className="mt-6 grid gap-4">
          <DemoTile word={word}>{children}</DemoTile>
          <CodeBlock kicker="install" code={`npx shadcn add @vsrc/${id}`} />
        </div>
      </Reveal>
    </section>
  );
}

/* The landing page's drifting-marquee backdrop, with any component dropped in —
   the fastest way to see how a surface treats a moving background. */
function Playground() {
  const [pick, setPick] = React.useState("glass-surface");
  return (
    <section id="playground" className="mt-12 scroll-mt-24">
      <Reveal delay={0.18}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{"// playground"}</p>
        <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">Playground</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Pick a surface and drop it over moving type. The middle stays still; the rim bends
          whatever drifts past.
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Choose a component">
          {COMPONENT_INDEX.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setPick(name)}
              aria-pressed={pick === name}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-xs transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring",
                pick === name
                  ? "bg-foreground/15 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <RefractionField key={pick}>{DEMOS[pick]}</RefractionField>
        </div>
      </Reveal>
    </section>
  );
}

/* Setup, first thing on the page: register the @vsrc namespace, add a
   component, use it. Per-component install commands live in each section
   below; this is the one-time registry wiring every consumer does once. */
function Installation() {
  return (
    <section id="installation" className="mt-14 scroll-mt-24">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {"// installation"}
        </p>
        <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">Installation</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Components are copied into your project through the shadcn CLI. The only npm package is{" "}
          <code className="font-mono text-sm text-foreground">vsrc</code> — the optics engine.
        </p>
        <div className="mt-6 grid max-w-3xl gap-6">
          <CodeBlock kicker="1 · components.json" code={REGISTRY_SNIPPET} />
          <CodeBlock kicker="2 · add a component" code={"npx shadcn add @vsrc/button"} />
          <CodeBlock kicker="3 · use it" code={USAGE_SNIPPET} />
        </div>
      </Reveal>
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <h1 className="display-stroke mt-6 font-display text-5xl sm:text-6xl">Components</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {`${COMPONENT_INDEX.length} surfaces, one optic.`} Install the registry once, then add any
          surface with the shadcn CLI — each refracts for real in Chromium; Safari and Firefox get
          clear frost.
        </p>
      </Reveal>

      <Installation />

      <Playground />

      <div className="mt-16 flex gap-12">
        <nav aria-label="Component index" className="sticky top-8 hidden h-fit w-44 shrink-0 lg:block">
          <ul className="grid gap-1 font-mono text-xs">
            {COMPONENT_INDEX.map((name) => (
              <li key={name}>
                <a
                  href={`#${name}`}
                  className="block rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid min-w-0 flex-1 gap-16">
          {SECTIONS.map(({ id, title, word, blurb }) => (
            <Section key={id} id={id} title={title} word={word} blurb={blurb}>
              {DEMOS[id]}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
