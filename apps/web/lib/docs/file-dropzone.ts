import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "file-dropzone",
  title: "File Dropzone",
  word: "file",
  blurb: "A drag-and-drop file zone with type, size and count validation, a per-file simulated upload bar and live announcements.",
  extendsRadix: null,
  props: [
    {
      component: "FileDropzone",
      rows: [
        { name: "accept", type: "string", description: "Same syntax as the input accept attribute: .pdf, image/*, image/png. Enforced for drops as well as the picker." },
        { name: "maxSize", type: "number", description: "Largest allowed file, in bytes." },
        { name: "maxFiles", type: "number", description: "Most files kept in the list. Extras are rejected with a message." },
        { name: "multiple", type: "boolean", default: "true", description: "When false, a new file replaces the current one." },
        { name: "onFilesChange", type: "(files: File[]) => void", description: "Fires with the accepted files whenever one is added or removed." },
        { name: "hint", type: "ReactNode", description: "Replaces the generated line listing types and limits." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the picker and drops." },
        GLASS_PROP("the dropzone"),
      ],
    },
  ],
  a11y: [
    "A real visually hidden file input is wired to the zone through a label, so Tab focuses it and Enter or Space opens the picker; the zone shows a focus ring.",
    "A polite live region announces files added, files rejected with the reason, and removals.",
    "Each progress bar is a role=\"progressbar\" with a file-specific name and value; each remove button is named \"Remove <file>\" and returns focus to the zone.",
    "Drag-over scale and lift are removed under prefers-reduced-motion; the dashed border and label still change.",
  ],
  optics: "ZONE_OPTICS: scale -72, chroma 3, border 0.1, mapBlur 12, blur 1, saturate 1.3, fallbackBlur 6, tuned for a mid-size panel. The drag-over scale uses transform only. File rows sit below the zone as plain cards, so no glass is nested.",
  e2e: { surface: '[data-slot="file-dropzone"]' },
};
