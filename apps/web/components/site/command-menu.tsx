"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { COMPONENT_INDEX } from "@/components/site/component-index";
import { toggleTheme } from "@/components/site/theme-toggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/vsrc/ui/command";

/** Site-wide ⌘K palette — dogfoods the registry `command` surface. Mounted once in layout. */
export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close first, then act on the next frame — the Dialog releases its scroll lock
  // as it unmounts, so an in-page scroll won't be trapped.
  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    requestAnimationFrame(fn);
  }, []);

  const goToComponent = React.useCallback(
    (name: string) => {
      if (pathname === "/components") {
        document.getElementById(name)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", `#${name}`);
      } else {
        router.push(`/components#${name}`);
      }
    },
    [pathname, router],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search components and actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="// components">
          {COMPONENT_INDEX.map((name) => (
            <CommandItem key={name} value={name} onSelect={() => run(() => goToComponent(name))}>
              {name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="// site">
          <CommandItem value="home" onSelect={() => run(() => router.push("/"))}>
            Home
          </CommandItem>
          <CommandItem value="components page" onSelect={() => run(() => router.push("/components"))}>
            Components
          </CommandItem>
          <CommandItem
            value="github"
            onSelect={() =>
              run(() => window.open("https://github.com/Karthick1242004/vsrc", "_blank", "noreferrer"))
            }
          >
            GitHub
            <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="// actions">
          <CommandItem value="toggle theme" onSelect={() => run(() => toggleTheme())}>
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
