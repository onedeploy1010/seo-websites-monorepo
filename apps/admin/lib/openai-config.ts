import { getSetting, SETTING_KEYS } from '@repo/database/lib/settings'

/**
 * 获取 OpenAI 配置
 * 优先级：数据库 > 环境变量
 */
export async function getOpenAIConfig(): Promise<{
  apiKey: string
  model: string
}> {
  // 尝试从数据库获取
  const dbApiKey = await getSetting(SETTING_KEYS.OPENAI_API_KEY)
  const dbModel = await getSetting(SETTING_KEYS.OPENAI_MODEL)

  // 使用数据库配置，或回退到环境变量
  const apiKey = dbApiKey || process.env.OPENAI_API_KEY || ''
  const model = dbModel || process.env.OPENAI_MODEL || 'gpt-4-turbo'

  if (!apiKey) {
    throw new Error(
      'OpenAI API Key 未配置。请在"系统设置"页面配置，或设置 OPENAI_API_KEY 环境变量'
    )
  }

  return { apiKey, model }
}

/**
 * 验证 OpenAI API Key 是否有效
 */
export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('验证 OpenAI Key 失败:', error)
    return false
  }
}
