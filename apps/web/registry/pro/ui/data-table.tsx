"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TABLE_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 3,
  border: 0.07,
  mapBlur: 14,
  blur: 3,
  saturate: 1.2,
  fallbackBlur: 4,
};

export interface DataTableColumn<T> {
  /** Property read from each row; also the sort and filter source unless `sortValue` is given. */
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: number | string;
  /** Value used for sorting when the displayed cell differs from the raw field. */
  sortValue?: (row: T) => string | number;
}

export interface DataTableProps<T extends object> extends Omit<React.ComponentProps<"div">, "children"> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable id per row. Defaults to the row's index in `data`. */
  getRowId?: (row: T, index: number) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  loading?: boolean;
  /** Visually hidden table caption; names the table for assistive tech. */
  caption?: string;
  filterPlaceholder?: string;
  emptyMessage?: React.ReactNode;
  /** Rendered at the end of the toolbar, e.g. an export button. */
  actions?: React.ReactNode;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

type Sort = { key: string; dir: "asc" | "desc" } | null;
type Entry<T> = { row: T; id: string };

const field = <T extends object>(row: T, key: string) => (row as Record<string, unknown>)[key];

function compare(a: unknown, b: unknown) {
  if (a == null || a === "") return b == null || b === "" ? 0 : 1;
  if (b == null || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "en", { numeric: true, sensitivity: "base" });
}

function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("size-3.5", className)} aria-hidden>
      <path d={d} />
    </svg>
  );
}

const checkbox = "size-4 cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";
const pagerButton = cn(
  "grid size-8 place-items-center rounded-full border border-border outline-none transition-colors hover:bg-foreground/10",
  "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
);

function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  pageSize = 8,
  pageSizeOptions = [5, 10, 25],
  selectable = false,
  onSelectionChange,
  loading = false,
  caption = "Data table",
  filterPlaceholder = "Filter rows",
  emptyMessage = "No results",
  actions,
  glass,
  className,
  ...props
}: DataTableProps<T>) {
  const filterId = React.useId();
  const sizeId = React.useId();
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<Sort>(null);
  const [size, setSize] = React.useState(pageSize);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(new Set());
  const headCheckbox = React.useRef<HTMLInputElement>(null);

  const rows = React.useMemo(() => {
    const entries: Entry<T>[] = data.map((row, i) => ({ row, id: getRowId?.(row, i) ?? String(i) }));
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter(({ row }) => columns.some((c) => String(field(row, c.key) ?? "").toLowerCase().includes(q)))
      : entries;
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!sort || !col) return filtered;
    const sign = sort.dir === "asc" ? 1 : -1;
    const value = (r: T) => (col.sortValue ? col.sortValue(r) : field(r, col.key));
    return [...filtered].sort((a, b) => sign * compare(value(a.row), value(b.row)));
  }, [data, columns, getRowId, query, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pageCount - 1);
  const visible = rows.slice(current * size, current * size + size);
  const pageSelected = visible.filter((e) => selected.has(e.id)).length;
  const allSelected = visible.length > 0 && pageSelected === visible.length;
  const span = columns.length + (selectable ? 1 : 0);

  React.useEffect(() => {
    if (headCheckbox.current) headCheckbox.current.indeterminate = pageSelected > 0 && !allSelected;
  });

  const commit = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.([...next]);
  };
  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (!next.delete(id)) next.add(id);
    commit(next);
  };
  const toggleAll = () => {
    const next = new Set(selected);
    for (const e of visible) {
      if (allSelected) next.delete(e.id);
      else next.add(e.id);
    }
    commit(next);
  };
  const cycleSort = (key: string) => {
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
    setPage(0);
  };

  const sortedBy = sort && columns.find((c) => c.key === sort.key);
  const first = rows.length ? current * size + 1 : 0;
  const last = Math.min(rows.length, current * size + size);

  return (
    <GlassSurface
      data-slot="data-table"
      glass={mergeGlass(TABLE_OPTICS, glass)}
      className={cn("flex w-full flex-col rounded-3xl text-foreground", className)}
      {...props}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="relative max-w-64 flex-1">
          <label htmlFor={filterId} className="sr-only">Filter rows</label>
          <Glyph d="M7 12a5 5 0 100-10 5 5 0 000 10zM14 14l-3.5-3.5" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            id={filterId}
            type="search"
            value={query}
            placeholder={filterPlaceholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="h-9 w-full rounded-full border border-border bg-background/40 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {selectable && selected.size > 0 && <p className="text-sm text-muted-foreground tabular-nums">{selected.size} selected</p>}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>

      <ScrollAreaPrimitive.Root className="relative min-h-0 overflow-hidden border-y border-border/60">
        <ScrollAreaPrimitive.Viewport
          role="region"
          aria-label={`${caption}, scrollable`}
          tabIndex={0}
          className="max-h-[22rem] w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <table aria-busy={loading} className="w-full border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                {selectable && (
                  <th scope="col" className="sticky top-0 z-10 w-10 bg-card py-2.5 pr-0 pl-4 text-left">
                    <input
                      ref={headCheckbox}
                      type="checkbox"
                      aria-label="Select all rows on this page"
                      className={checkbox}
                      checked={allSelected}
                      disabled={loading || visible.length === 0}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {columns.map((c) => {
                  const dir = sort?.key === c.key ? sort.dir : null;
                  const align = c.align ?? "left";
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={c.sortable ? (dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none") : undefined}
                      style={{ width: c.width }}
                      className={cn(
                        "sticky top-0 z-10 bg-card px-4 py-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground",
                        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
                      )}
                    >
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => cycleSort(c.key)}
                          className={cn(
                            "group -mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                            dir && "text-foreground",
                          )}
                        >
                          {c.header}
                          <Glyph
                            d={dir === "desc" ? "M8 3v10M4 9l4 4 4-4" : dir === "asc" ? "M8 13V3M4 7l4-4 4 4" : "M5 6l3-3 3 3M5 10l3 3 3-3"}
                            className={cn("transition-opacity motion-reduce:transition-none", dir ? "opacity-100" : "opacity-40 group-hover:opacity-80")}
                          />
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: Math.min(size, 8) }, (_, r) => (
                  <tr key={r} className="border-t border-border/60" aria-hidden>
                    {selectable && <td className="py-3 pl-4"><span className="block size-4 animate-pulse rounded bg-foreground/10 motion-reduce:animate-none" /></td>}
                    {columns.map((c, ci) => (
                      <td key={c.key} className="px-4 py-3">
                        <span
                          className={cn("block h-3.5 animate-pulse rounded-full bg-foreground/10 motion-reduce:animate-none", c.align === "right" && "ml-auto")}
                          style={{ width: `${55 + ((r * 7 + ci * 13) % 40)}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading && visible.length === 0 && (
                <tr className="border-t border-border/60">
                  <td colSpan={span} className="px-4 py-12 text-center text-muted-foreground">
                    <p>{emptyMessage}</p>
                    {query && (
                      <button type="button" onClick={() => setQuery("")} className="mt-2 rounded-md px-2 py-1 text-sm text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        Clear filter
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map(({ row, id }) => {
                  const isSelected = selected.has(id);
                  return (
                    <tr key={id} data-state={isSelected ? "selected" : undefined} className="border-t border-border/60 transition-colors hover:bg-foreground/5 data-[state=selected]:bg-primary/10 motion-reduce:transition-none">
                      {selectable && (
                        <td className="w-10 py-3 pr-0 pl-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${String(field(row, columns[0]?.key ?? "") ?? id)}`}
                            className={checkbox}
                            checked={isSelected}
                            onChange={() => toggleRow(id)}
                          />
                        </td>
                      )}
                      {columns.map((c) => (
                        <td key={c.key} className={cn("px-4 py-3", c.align === "right" ? "text-right tabular-nums" : c.align === "center" ? "text-center" : "text-left")}>
                          {c.cell ? c.cell(row) : String(field(row, c.key) ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </ScrollAreaPrimitive.Viewport>
        {(["vertical", "horizontal"] as const).map((orientation) => (
          <ScrollAreaPrimitive.Scrollbar
            key={orientation}
            orientation={orientation}
            className={cn("flex touch-none p-0.5 select-none", orientation === "vertical" ? "w-2.5" : "h-2.5 flex-col")}
          >
            <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-foreground/25" />
          </ScrollAreaPrimitive.Scrollbar>
        ))}
      </ScrollAreaPrimitive.Root>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor={sizeId}>Rows per page</label>
          <select
            id={sizeId}
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="h-8 rounded-full border border-border bg-background/40 px-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {[...new Set([pageSize, ...pageSizeOptions])].sort((a, b) => a - b).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <p aria-live="polite" className="tabular-nums">
            {loading ? "Loading…" : `${first}–${last} of ${rows.length}`}
            <span className="sr-only">{sortedBy ? `, sorted by ${sortedBy.header} ${sort?.dir === "asc" ? "ascending" : "descending"}` : ""}</span>
          </p>
          <button type="button" aria-label="Previous page" className={pagerButton} disabled={current === 0} onClick={() => setPage(current - 1)}>
            <Glyph d="M10 3L5 8l5 5" />
          </button>
          <button type="button" aria-label="Next page" className={pagerButton} disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
            <Glyph d="M6 3l5 5-5 5" />
          </button>
        </div>
      </div>
    </GlassSurface>
  );
}

export { DataTable };
