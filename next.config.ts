import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixează rădăcina proiectului (evită indexarea întregului home din cauza altor lockfile-uri).
  turbopack: { root: import.meta.dirname },
  // Transpilează lucide-react ca să nu spargă React Client Manifest (Turbopack RSC).
  transpilePackages: ["lucide-react"],
  // Pachete native / server-only ce nu trebuie bundle-uite de Turbopack.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
