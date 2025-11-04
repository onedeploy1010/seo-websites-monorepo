import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getOpenAIConfig } from '@/lib/openai-config'

export const runtime = 'nodejs'
export const maxDuration = 300

interface GenerateKeywordsRequest {
  content: string
  targetLanguage?: string
  count?: number
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateKeywordsRequest = await req.json()
    const { content, targetLanguage = 'zh-CN', count = 10 } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // 获取 OpenAI 配置（优先数据库，fallback 到环境变量）
    const { apiKey, model } = await getOpenAIConfig()

    const lang = targetLanguage === 'zh-CN' ? '中文' : 'English'

    const prompt = `You are an expert SEO keyword researcher. Analyze the following content and generate a comprehensive list of SEO keywords.

**Content:** ${content.substring(0, 1000)}...

**Target Language:** ${lang}

Generate ${count} high-value SEO keywords that:
1. Are relevant to the content
2. Have good search volume potential
3. Include a mix of:
   - Primary keywords (high competition, high volume)
   - Long-tail keywords (low competition, specific intent)
   - LSI (Latent Semantic Indexing) keywords

For each keyword, provide:
- The keyword phrase
- Estimated search difficulty (0-100)
- Estimated monthly search volume
- Intent type (informational, transactional, navigational)

Return ONLY valid JSON array in this format:
[
  {
    "keyword": "string",
    "difficulty": number,
    "volume": number,
    "intent": "informational" | "transactional" | "navigational"
  }
]`

    const { text } = await generateText({
      model: openai(model, { apiKey }),
      prompt,
      temperature: 0.8,
      maxTokens: 1500,
    })

    let keywords
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON array found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: text },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: keywords,
    })
  } catch (error) {
    console.error('AI keyword generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate keywords',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
