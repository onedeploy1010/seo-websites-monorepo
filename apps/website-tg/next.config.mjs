/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: false, // 启用图片优化
  },
  // Vercel 部署不需要 output: 'standalone'
  // 只在 Docker 容器部署时使用
}

export default nextConfig
