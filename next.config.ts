import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["qrcode", "@prisma/client"],
};

export default nextConfig;
