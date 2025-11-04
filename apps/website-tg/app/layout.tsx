import type { Metadata } from 'next'
import './globals.css'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.telegramtgm.com'),
  title: 'Telegram TGM - 专业的 Telegram 营销服务平台',
  description: '提供专业的 Telegram 频道推广、会员增长、内容营销等服务，帮助您快速扩大影响力',
  keywords: 'telegram, 营销, 推广, 会员增长, 频道推广',
  authors: [{ name: 'Telegram TGM' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.telegramtgm.com',
    siteName: 'Telegram TGM',
    title: 'Telegram TGM - 专业的 Telegram 营销服务平台',
    description: '提供专业的 Telegram 频道推广、会员增长、内容营销等服务',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Telegram TGM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telegram TGM - 专业的 Telegram 营销服务平台',
    description: '提供专业的 Telegram 频道推广、会员增长、内容营销等服务',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  )
}
