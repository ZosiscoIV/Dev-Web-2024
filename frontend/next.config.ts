import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    experimental: {
        forceSwcTransforms: true,
    },
}

export default nextConfig;
