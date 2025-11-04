/**
 * SEO 工具函数
 */

// 生成页面标题
export function generatePageTitle(title: string): string {
  return `${title} | Telegram TGM`
}

// 生成页面描述
export function generatePageDescription(description: string): string {
  return description.length > 160 ? description.substring(0, 157) + '...' : description
}

// 生成关键词
export function generateKeywords(keywords: string[]): string {
  return keywords.join(', ')
}

// 生成 Open Graph 图片 URL
export function generateOgImageUrl(path: string): string {
  const baseUrl = 'https://www.telegramtgm.com'
  return `${baseUrl}${path}`
}

// 生成结构化数据
export function generateStructuredData(type: string, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }
}

// 生成面包屑导航数据
export function generateBreadcrumbData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// 验证并清理 URL
export function cleanUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}
