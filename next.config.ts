import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['static.wikia.nocookie.net', 's3.amazonaws.com'],
  },
};

export default nextConfig;
