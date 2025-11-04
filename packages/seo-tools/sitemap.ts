import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export interface SitemapUrl {
  url: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  lastmod?: string
}

export async function generateSitemap(
  hostname: string,
  urls: SitemapUrl[]
): Promise<string> {
  const stream = new SitemapStream({ hostname })

  const xmlString = await streamToPromise(
    Readable.from(urls).pipe(stream)
  ).then((data) => data.toString())

  return xmlString
}

export async function submitSitemapToGoogle(sitemapUrl: string) {
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`

  try {
    const response = await fetch(pingUrl)
    return { success: response.ok, status: response.status }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function submitSitemapToBaidu(sitemapUrl: string, site: string, token: string) {
  const baiduUrl = `http://data.zz.baidu.com/urls?site=${site}&token=${token}`

  try {
    const response = await fetch(baiduUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: sitemapUrl,
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function submitSitemapToBing(sitemapUrl: string, apiKey: string) {
  const bingUrl = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`

  try {
    const response = await fetch(bingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl: sitemapUrl.split('/sitemap')[0],
        urlList: [sitemapUrl],
      }),
    })
    return { success: response.ok, status: response.status }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
