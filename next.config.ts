import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir imports de imagens de qualquer domínio se necessário no futuro
  images: {
    remotePatterns: [],
  },
  // Path alias @/ já configurado via tsconfig
};

export default nextConfig;
