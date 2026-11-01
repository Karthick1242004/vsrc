"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/vsrc/ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="engine" className="w-[min(28rem,80vw)]">
      <AccordionItem value="engine">
        <AccordionTrigger>How does the glass bend things?</AccordionTrigger>
        <AccordionContent>
          A displacement map built from the pane&apos;s own edge pushes the backdrop outward at the rim and magnifies the middle a little.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="safari">
        <AccordionTrigger>What happens in Safari?</AccordionTrigger>
        <AccordionContent>
          Safari and Firefox can&apos;t paint SVG filters behind a pane, so they get clear frost with the same material.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="own">
        <AccordionTrigger>Do I own the code?</AccordionTrigger>
        <AccordionContent>The CLI copies the source into your project, so you can change anything.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
