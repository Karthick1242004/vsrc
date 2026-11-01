"use client";

import * as React from "react";

import { Button } from "@/registry/vsrc/ui/button";
import { NotificationCentre, type NotificationItem } from "@/registry/pro/ui/notification-centre";

const SEED: NotificationItem[] = [
  { id: "n1", name: "Maya Chen", text: "mentioned you in “Launch checklist”", time: "12 min ago", group: "today", read: false },
  { id: "n2", name: "Deb Okafor", text: "requested your review on pricing copy", time: "1 hr ago", group: "today", read: false },
  { id: "n3", name: "Northwind Billing", text: "paid invoice INV-2041 for $1,240.00", time: "3 hr ago", group: "today", read: true },
  { id: "n4", name: "Ravi Menon", text: "commented on the Q3 roadmap", time: "Yesterday", group: "earlier", read: false },
  { id: "n5", name: "Sofia Alvarez", text: "joined the Lumen workspace", time: "Mon", group: "earlier", read: true },
  { id: "n6", name: "Deploy Bot", text: "shipped northwind-web v2.14.0", time: "Sun", group: "earlier", read: true },
];

export function NotificationCentreDemo() {
  const [items, setItems] = React.useState(SEED);

  return (
    <div className="flex items-center gap-3">
      <NotificationCentre
        notifications={items}
        onRead={(ids) => setItems((all) => all.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)))}
        onClear={() => setItems([])}
      />
      <Button variant="ghost" size="sm" onClick={() => setItems(SEED)} disabled={items.length === SEED.length && items.every((n, i) => n.read === SEED[i]?.read)}>
        Reset demo
      </Button>
    </div>
  );
}
