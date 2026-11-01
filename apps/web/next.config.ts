import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Pro registry route reads component source at request time; ship those
  // files inside its serverless function (they are never in public/).
  outputFileTracingIncludes: {
    "/r/pro/[name]": ["./registry/pro/ui/**/*"],
  },
};

export default nextConfig;
