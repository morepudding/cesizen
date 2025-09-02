import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactive ESLint durant le build pour Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore les erreurs TypeScript durant le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
