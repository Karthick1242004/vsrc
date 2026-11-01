"use client";

import { useEffect, useState } from "react";

import { DataTable, type DataTableColumn } from "@/registry/pro/ui/data-table";

type Status = "Paid" | "Pending" | "Overdue" | "Draft";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: Status;
  due: string;
}

/** Sample invoices; ISO dates so they sort as plain strings. */
export const ARTWORKS: Invoice[] = [
  { id: "INV-2041", client: "Halden & Co.", amount: 4820, status: "Paid", due: "2026-10-02" },
  { id: "INV-2042", client: "Marlow Studio", amount: 1350, status: "Paid", due: "2026-10-09" },
  { id: "INV-2043", client: "Northwind Freight", amount: 9275.5, status: "Overdue", due: "2026-10-14" },
  { id: "INV-2044", client: "Okafor Architects", amount: 2640, status: "Pending", due: "2026-11-03" },
  { id: "INV-2045", client: "Tidewater Labs", amount: 15400, status: "Pending", due: "2026-11-08" },
  { id: "INV-2046", client: "Bright Orchard", amount: 780, status: "Paid", due: "2026-10-21" },
  { id: "INV-2047", client: "Verbena Health", amount: 6120, status: "Overdue", due: "2026-10-18" },
  { id: "INV-2048", client: "Lindqvist & Sons", amount: 3390, status: "Draft", due: "2026-11-20" },
  { id: "INV-2049", client: "Paper Lantern Press", amount: 920, status: "Paid", due: "2026-10-27" },
  { id: "INV-2050", client: "Quayside Coffee", amount: 1485, status: "Pending", due: "2026-11-12" },
  { id: "INV-2051", client: "Aurelia Dental", amount: 5210, status: "Paid", due: "2026-10-30" },
  { id: "INV-2052", client: "Kestrel Outdoor", amount: 7680, status: "Draft", due: "2026-12-01" },
  { id: "INV-2053", client: "Fennel & Fig", amount: 2075, status: "Pending", due: "2026-11-17" },
  { id: "INV-2054", client: "Ridgeway Logistics", amount: 11930, status: "Overdue", due: "2026-10-11" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOT: Record<Status, string> = {
  Paid: "bg-primary",
  Pending: "bg-signal",
  Overdue: "bg-foreground",
  Draft: "bg-muted-foreground/60",
};
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns: DataTableColumn<Invoice>[] = [
  { key: "id", header: "Invoice", sortable: true, width: 112, cell: (r) => <span className="font-medium">{r.id}</span> },
  { key: "client", header: "Client", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (r) => (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className={`size-2 rounded-full ${DOT[r.status]}`} />
        {r.status}
      </span>
    ),
  },
  {
    key: "due",
    header: "Due",
    sortable: true,
    cell: (r) => {
      const [y, m, d] = r.due.split("-");
      return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
    },
  },
  { key: "amount", header: "Amount", sortable: true, align: "right", cell: (r) => money.format(r.amount) },
];

export function DataTableDemo() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="w-[min(calc(100vw-6rem),46rem)]">
      <DataTable
        caption="Invoices"
        columns={columns}
        data={ARTWORKS}
        getRowId={(r) => r.id}
        pageSize={5}
        pageSizeOptions={[5, 10]}
        selectable
        loading={loading}
        filterPlaceholder="Filter invoices"
        emptyMessage="No invoices match that filter."
        actions={
          <button
            type="button"
            onClick={() => setLoading(true)}
            disabled={loading}
            className="h-9 rounded-full border border-border px-4 text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Refresh
          </button>
        }
      />
    </div>
  );
}
