import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    experimental: {
        forceSwcTransforms: true,
    },
    images: {
        unoptimized: true,
    },
    // 👇 permet d'avoir une page HTML pour les routes inconnues
    trailingSlash: true,
};

module.exports = nextConfig;
