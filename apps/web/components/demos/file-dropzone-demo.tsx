"use client";

import * as React from "react";

import { FileDropzone } from "@/registry/pro/ui/file-dropzone";

export function FileDropzoneDemo() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <FileDropzone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={4} onFilesChange={(files) => setCount(files.length)} />
      <p className="text-xs text-foreground/80">{count === 0 ? "Brand assets for the Q4 campaign" : `${count} of 4 files attached`}</p>
    </div>
  );
}
