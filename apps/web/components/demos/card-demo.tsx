"use client";

import { Button } from "@/registry/vsrc/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/vsrc/ui/card";

export function CardDemo() {
  return (
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
  );
}
