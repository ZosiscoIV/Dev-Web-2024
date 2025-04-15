import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: true,
    },
    output: 'export', // 👈 Ajoute cette ligne
};

module.exports = nextConfig;

