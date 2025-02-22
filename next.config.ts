import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  images: {
    domains: ["images.unsplash.com"], 
  },
};

export default nextConfig;
