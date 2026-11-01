"use client";

import { Button } from "@/registry/vsrc/ui/button";
import { HeroSection } from "@/registry/pro/ui/hero-section";

export function HeroSectionDemo() {
  return (
    <HeroSection
      className="max-w-3xl"
      headline="Light, bent on purpose."
      description="Panels that really refract what sits behind them, in code you own. Drop a block in, keep the motion, ship the page."
      primaryAction={
        <Button variant="primary" size="lg">
          Start building
        </Button>
      }
      secondaryAction={<Button size="lg">Browse components</Button>}
      backdropWords={["Refract", "Reflect", "Bend"]}
    />
  );
}
