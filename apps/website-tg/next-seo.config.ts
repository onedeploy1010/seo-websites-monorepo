import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  titleTemplate: '%s | Telegram TGM',
  defaultTitle: 'Telegram TGM - 专业的 Telegram 营销服务平台',
  description: '提供专业的 Telegram 频道推广、会员增长、内容营销等服务，帮助您快速扩大影响力',
  canonical: 'https://www.telegramtgm.com',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.telegramtgm.com',
    siteName: 'Telegram TGM',
    images: [
      {
        url: 'https://www.telegramtgm.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Telegram TGM',
      },
    ],
  },
  twitter: {
    handle: '@telegramtgm',
    site: '@telegramtgm',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'telegram, 营销, 推广, 会员增长, 频道推广, TG营销, Telegram推广',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
}

export default config
