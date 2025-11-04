/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/database', '@repo/seo-tools'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3100'],
    },
  },
}

module.exports = nextConfig
