import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@repo/ui-components/components/Header'
import Footer from '@repo/ui-components/components/Footer'
import { getDomainSEOMetadata } from '@/lib/get-website-by-domain'

const inter = Inter({ subsets: ['latin'] })

// 动态生成SEO元数据，根据访问的域名
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDomainSEOMetadata()

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
