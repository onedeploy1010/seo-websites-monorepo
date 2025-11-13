// 搜索引擎蜘蛛检测
export interface SpiderInfo {
  isBot: boolean
  botName: string | null
  searchEngine: string | null
}

export function detectSpider(userAgent: string): SpiderInfo {
  const ua = userAgent.toLowerCase()

  const bots = [
    { name: 'googlebot', engine: 'google', pattern: /googlebot/i },
    { name: 'bingbot', engine: 'bing', pattern: /bingbot/i },
    { name: 'baiduspider', engine: 'baidu', pattern: /baiduspider/i },
    { name: 'yandexbot', engine: 'yandex', pattern: /yandexbot/i },
    { name: 'sogou', engine: 'sogou', pattern: /sogou/i },
    { name: '360spider', engine: '360', pattern: /360spider/i },
    { name: 'slurp', engine: 'yahoo', pattern: /slurp/i },
    { name: 'duckduckbot', engine: 'duckduckgo', pattern: /duckduckbot/i },
  ]

  for (const bot of bots) {
    if (bot.pattern.test(ua)) {
      return {
        isBot: true,
        botName: bot.name,
        searchEngine: bot.engine,
      }
    }
  }

  return {
    isBot: false,
    botName: null,
    searchEngine: null,
  }
}

// 蜘蛛访问频率限制
export class SpiderRateLimiter {
  private visits: Map<string, number[]> = new Map()
  private maxVisitsPerMinute: number

  constructor(maxVisitsPerMinute: number = 10) {
    this.maxVisitsPerMinute = maxVisitsPerMinute
  }

  canVisit(ip: string): boolean {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // 获取该IP的访问记录
    let timestamps = this.visits.get(ip) || []

    // 清理超过1分钟的记录
    timestamps = timestamps.filter(t => t > oneMinuteAgo)

    if (timestamps.length >= this.maxVisitsPerMinute) {
      return false
    }

    timestamps.push(now)
    this.visits.set(ip, timestamps)
    return true
  }

  // 定期清理过期数据
  cleanup() {
    const oneMinuteAgo = Date.now() - 60000
    Array.from(this.visits.entries()).forEach(([ip, timestamps]) => {
      const filtered = timestamps.filter(t => t > oneMinuteAgo)
      if (filtered.length === 0) {
        this.visits.delete(ip)
      } else {
        this.visits.set(ip, filtered)
      }
    })
  }
}

// 生成robots.txt
export function generateRobotsTxt(config: {
  allowPaths?: string[]
  disallowPaths?: string[]
  sitemapUrl?: string
  crawlDelay?: number
}): string {
  const lines: string[] = ['User-agent: *']

  // 允许的路径
  if (config.allowPaths) {
    config.allowPaths.forEach(path => {
      lines.push(`Allow: ${path}`)
    })
  }

  // 禁止的路径
  if (config.disallowPaths) {
    config.disallowPaths.forEach(path => {
      lines.push(`Disallow: ${path}`)
    })
  }

  // 爬取延迟
  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`)
  }

  // Sitemap位置
  if (config.sitemapUrl) {
    lines.push('', `Sitemap: ${config.sitemapUrl}`)
  }

  return lines.join('\n')
}
