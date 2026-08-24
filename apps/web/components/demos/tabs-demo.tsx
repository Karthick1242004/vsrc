"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/vsrc/ui/tabs";

export function TabsDemo() {
  return (
    <Tabs defaultValue="optics" className="items-center">
      <TabsList>
        <TabsTrigger value="optics">Optics</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="a11y">A11y</TabsTrigger>
      </TabsList>
      <TabsContent value="optics" className="text-sm text-muted-foreground">
        Three staggered displacement passes.
      </TabsContent>
      <TabsContent value="tokens" className="text-sm text-muted-foreground">
        Everything themable via --glass-*.
      </TabsContent>
      <TabsContent value="a11y" className="text-sm text-muted-foreground">
        Radix keyboard behavior, untouched.
      </TabsContent>
    </Tabs>
  );
}
