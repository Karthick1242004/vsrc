"use client";

import { CodeBlock } from "@/components/site/code-block";
import { Monogram } from "@/components/site/monogram";
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
  Dialog,
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
import { Input } from "@/registry/vsrc/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/vsrc/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/vsrc/ui/sheet";
import { Switch } from "@/registry/vsrc/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/vsrc/ui/tabs";
import { toast } from "@/registry/vsrc/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/vsrc/ui/tooltip";

/* Every demo floats over type and warm color so the glass has something to
   bend — same reason the landing demo band exists. */
function DemoTile({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[32px] border border-border p-10">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-1/3 -left-1/4 size-80 rounded-full bg-signal/40 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/3 size-72 rounded-full bg-primary/35 blur-3xl" />
        <p className="absolute top-1/2 left-1/2 -translate-1/2 font-display text-[6rem] leading-none whitespace-nowrap text-foreground/80 italic">
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
      <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{`// ${id}`}</p>
      <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{blurb}</p>
      <div className="mt-6 grid gap-4">
        <DemoTile word={word}>{children}</DemoTile>
        <CodeBlock kicker="install" code={`npx shadcn add @vsrc/${id}`} />
      </div>
    </section>
  );
}

const INDEX = [
  "glass-surface",
  "button",
  "card",
  "input",
  "switch",
  "tabs",
  "tooltip",
  "popover",
  "dropdown-menu",
  "dialog",
  "sheet",
  "toast",
  "dock",
];

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <h1 className="display-stroke mt-6 font-display text-5xl sm:text-6xl">Components</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Thirteen surfaces, one optic. Each is copied into your project via the shadcn CLI and
        refracts for real in Chromium; Safari and Firefox get clear frost.
      </p>

      <div className="mt-12 flex gap-12">
        <nav aria-label="Component index" className="sticky top-8 hidden h-fit w-44 shrink-0 lg:block">
          <ul className="grid gap-1 font-mono text-xs">
            {INDEX.map((name) => (
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
          <Section id="glass-surface" title="Glass Surface" word="primitive" blurb="The refraction primitive every other component builds on.">
            <GlassSurface className="max-w-xs p-6">
              <p className="font-display text-xl">Everything bends at the rim.</p>
            </GlassSurface>
          </Section>

          <Section id="button" title="Button" word="press" blurb="Clear glass by default, one red primary per view, ghost for quiet chrome.">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button variant="primary">Primary</Button>
              <Button size="sm">Small</Button>
            </div>
          </Section>

          <Section id="card" title="Card" word="panel" blurb="A glass panel with the usual card anatomy.">
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
          </Section>

          <Section id="input" title="Input" word="type here" blurb="A glass field. The backdrop stays legible behind your text.">
            <Input placeholder="hello@vsrc.dev" className="w-64" aria-label="Email" />
          </Section>

          <Section id="switch" title="Switch" word="on / off" blurb="Glass track, cream thumb, red when checked.">
            <div className="flex items-center gap-3">
              <Switch defaultChecked aria-label="Demo switch" />
            </div>
          </Section>

          <Section id="tabs" title="Tabs" word="sections" blurb="A glass pill list with quiet triggers.">
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
          </Section>

          <Section id="tooltip" title="Tooltip" word="hover" blurb="A small glass pill on hover or focus.">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Real refraction, even here</TooltipContent>
            </Tooltip>
          </Section>

          <Section id="popover" title="Popover" word="anchored" blurb="Anchored glass panel for small forms and detail.">
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
          </Section>

          <Section id="dropdown-menu" title="Dropdown Menu" word="choose" blurb="Glass menu with Radix keyboard navigation.">
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
          </Section>

          <Section id="dialog" title="Dialog" word="modal" blurb="A modal glass pane over a dimmed page.">
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
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Ship</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          <Section id="sheet" title="Sheet" word="slide" blurb="A side panel of glass; softer optics keep big maps cheap.">
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
          </Section>

          <Section id="toast" title="Toast" word="notify" blurb="Glass-styled sonner. Toasts move constantly, so they skip the displacement engine by design.">
            <Button onClick={() => toast("Copied install command", { description: "npx shadcn add @vsrc/toast" })}>
              Fire a toast
            </Button>
          </Section>

          <Section id="dock" title="Dock" word="navigate" blurb="The signature piece — the brand board's docked nav, in glass.">
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
          </Section>
        </div>
      </div>
    </div>
  );
}
