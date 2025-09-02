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
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['lottie-react'],
};

export default nextConfig;
