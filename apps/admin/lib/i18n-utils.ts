import { cookies } from 'next/headers'

export type Locale = 'en' | 'zh'

export const defaultLocale: Locale = 'zh'
export const locales: Locale[] = ['en', 'zh']

/**
 * 从 Cookie 获取当前语言
 */
export function getLocale(): Locale {
  const cookieStore = cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')

  const locale = localeCookie?.value as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

/**
 * 加载翻译文件
 */
export async function getTranslations(locale: Locale = 'zh') {
  try {
    const messages = await import(`@/messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    const fallbackMessages = await import(`@/messages/${defaultLocale}.json`)
    return fallbackMessages.default
  }
}

/**
 * 获取翻译函数
 */
export function createTranslator(messages: any) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // 返回 key 作为降级
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // 替换参数
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }
}
