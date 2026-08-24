import { COMPONENT_DOCS } from "@/lib/component-docs";

/** The registry surfaces, in docs order — derived from the doc registry so the
 *  nav, ⌘K palette, and page counts can never drift from the documentation. */
export const COMPONENT_INDEX = COMPONENT_DOCS.map((doc) => doc.slug);
