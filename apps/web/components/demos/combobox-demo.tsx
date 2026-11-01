"use client";

import * as React from "react";

import { Combobox, type ComboboxOption } from "@/registry/pro/ui/combobox";

const FRAMEWORKS: ComboboxOption[] = [
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "gatsby", label: "Gatsby", group: "React", disabled: true },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "vitepress", label: "VitePress", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "astro", label: "Astro", group: "Content" },
  { value: "eleventy", label: "Eleventy", group: "Content" },
];

const TEAM: ComboboxOption[] = [
  { value: "amara", label: "Amara Osei" },
  { value: "bjorn", label: "Bjorn Lindqvist" },
  { value: "chen", label: "Chen Wei" },
  { value: "dalia", label: "Dalia Haddad" },
  { value: "emeka", label: "Emeka Nwosu" },
  { value: "freya", label: "Freya Sorensen" },
];

export function ComboboxDemo() {
  const [framework, setFramework] = React.useState<string | undefined>("next");
  const [people, setPeople] = React.useState<string[]>(["amara", "chen"]);

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
      <Combobox aria-label="Framework" options={FRAMEWORKS} value={framework} onValueChange={setFramework} placeholder="Pick a framework" />
      <Combobox aria-label="Reviewers" multiple options={TEAM} value={people} onValueChange={setPeople} placeholder="Add reviewers" />
    </div>
  );
}
