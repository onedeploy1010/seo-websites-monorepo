import axios from 'axios'
import * as cheerio from 'cheerio'

export interface RankResult {
  keyword: string
  position: number | null
  url: string | null
  searchEngine: string
  error?: string
}

// Google排名检查（需要使用Google Custom Search API或爬虫）
export async function checkGoogleRank(
  keyword: string,
  domain: string,
  apiKey?: string,
  searchEngineId?: string
): Promise<RankResult> {
  try {
    if (apiKey && searchEngineId) {
      // 使用Google Custom Search API
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(keyword)}`
      )

      const items = response.data.items || []
      const position = items.findIndex((item: any) =>
        item.link.includes(domain)
      )

      return {
        keyword,
        position: position >= 0 ? position + 1 : null,
        url: position >= 0 ? items[position].link : null,
        searchEngine: 'google',
      }
    } else {
      // 简单爬虫方式（生产环境不推荐）
      const response = await axios.get(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      )

      const $ = cheerio.load(response.data)
      let position: number | null = null
      let url: string | null = null

      $('div.g').each((index: number, element: any) => {
        const link = $(element).find('a').attr('href')
        if (link && link.includes(domain) && position === null) {
          position = index + 1
          url = link
        }
      })

      return { keyword, position, url, searchEngine: 'google' }
    }
  } catch (error: any) {
    return {
      keyword,
      position: null,
      url: null,
      searchEngine: 'google',
      error: error.message,
    }
  }
}

// 百度排名检查
export async function checkBaiduRank(
  keyword: string,
  domain: string
): Promise<RankResult> {
  try {
    const response = await axios.get(
      `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}&rn=100`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    const $ = cheerio.load(response.data)
    let position: number | null = null
    let url: string | null = null

    $('div.result').each((index: number, element: any) => {
      const link = $(element).find('a').attr('href')
      if (link && link.includes(domain) && position === null) {
        position = index + 1
        url = link
      }
    })

    return { keyword, position, url, searchEngine: 'baidu' }
  } catch (error: any) {
    return {
      keyword,
      position: null,
      url: null,
      searchEngine: 'baidu',
      error: error.message,
    }
  }
}

// 批量检查排名
export async function checkRankings(
  keywords: string[],
  domain: string,
  searchEngines: ('google' | 'baidu')[] = ['google', 'baidu']
): Promise<RankResult[]> {
  const results: RankResult[] = []

  for (const keyword of keywords) {
    for (const engine of searchEngines) {
      let result: RankResult

      if (engine === 'google') {
        result = await checkGoogleRank(keyword, domain)
      } else {
        result = await checkBaiduRank(keyword, domain)
      }

      results.push(result)

      // 添加延迟，避免被封IP
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  return results
}
