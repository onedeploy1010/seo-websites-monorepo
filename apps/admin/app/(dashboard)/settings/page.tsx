'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Setting = {
  id: string
  key: string
  value: string
  description?: string
  category: string
  isEncrypted: boolean
  updatedAt: string
}

type SettingInput = {
  key: string
  value: string
  description?: string
  category: string
  isEncrypted: boolean
}

const CATEGORIES = {
  API: 'API 配置',
  SEO: 'SEO 设置',
  ANALYTICS: '分析工具',
  NOTIFICATION: '通知设置',
  GENERAL: '通用设置',
}

// 预定义的设置模板
const SETTING_TEMPLATES: SettingInput[] = [
  {
    key: 'openai_api_key',
    value: '',
    description: 'OpenAI API Key（用于 AI SEO 优化）',
    category: 'API',
    isEncrypted: true,
  },
  {
    key: 'openai_model',
    value: 'gpt-4-turbo',
    description: 'OpenAI 模型（gpt-4-turbo, gpt-3.5-turbo）',
    category: 'API',
    isEncrypted: false,
  },
  {
    key: 'google_analytics_id',
    value: '',
    description: 'Google Analytics 测量 ID (G-XXXXXXXXXX)',
    category: 'ANALYTICS',
    isEncrypted: false,
  },
  {
    key: 'google_search_console_id',
    value: '',
    description: 'Google Search Console 验证码',
    category: 'SEO',
    isEncrypted: false,
  },
  {
    key: 'bing_webmaster_key',
    value: '',
    description: 'Bing Webmaster API Key',
    category: 'SEO',
    isEncrypted: true,
  },
  {
    key: 'baidu_tongji_id',
    value: '',
    description: '百度统计 ID',
    category: 'ANALYTICS',
    isEncrypted: false,
  },
]

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Setting[]>([])
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('API')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data.settings || [])

      // 初始化编辑状态
      const initialEditing: Record<string, string> = {}
      data.settings?.forEach((setting: Setting) => {
        initialEditing[setting.key] = setting.isEncrypted ? '' : setting.value
      })
      setEditingSettings(initialEditing)
    } catch (error) {
      console.error('加载设置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // 过滤出有变化的设置
      const updates = Object.entries(editingSettings)
        .filter(([key, value]) => {
          const existing = settings.find((s) => s.key === key)
          // 对于加密字段，只有当新值不为空时才更新
          if (existing?.isEncrypted) {
            return value.trim() !== ''
          }
          return value !== existing?.value
        })
        .map(([key, value]) => {
          const template = SETTING_TEMPLATES.find((t) => t.key === key)
          const existing = settings.find((s) => s.key === key)
          return {
            key,
            value,
            description: existing?.description || template?.description,
            category: existing?.category || template?.category || 'GENERAL',
            isEncrypted: existing?.isEncrypted ?? template?.isEncrypted ?? false,
          }
        })

      if (updates.length === 0) {
        alert('没有需要保存的更改')
        setSaving(false)
        return
      }

      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates }),
      })

      if (!response.ok) throw new Error('保存失败')

      alert('设置保存成功！')
      await loadSettings()
    } catch (error) {
      console.error('保存设置失败:', error)
      alert('保存设置失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setEditingSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const filteredTemplates = SETTING_TEMPLATES.filter(
    (template) => template.category === selectedCategory
  )

  // 合并模板和已存在的设置
  const displaySettings = filteredTemplates.map((template) => {
    const existing = settings.find((s) => s.key === template.key)
    return existing || { ...template, id: template.key, updatedAt: '' }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-2 text-gray-600">
            配置 API Keys 和系统参数，无需修改环境变量和重新部署
          </p>
        </div>

        {/* 分类选项卡 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* 设置表单 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {displaySettings.map((setting) => (
              <div key={setting.key} className="border-b border-gray-200 pb-6 last:border-b-0">
                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {setting.description || setting.key}
                    </span>
                    {setting.isEncrypted && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        🔒 加密
                      </span>
                    )}
                  </div>
                  <input
                    type={setting.isEncrypted ? 'password' : 'text'}
                    value={editingSettings[setting.key] || ''}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    placeholder={
                      setting.isEncrypted
                        ? '留空表示不修改'
                        : setting.value || '请输入...'
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Key: <code className="bg-gray-100 px-1 rounded">{setting.key}</code>
                    {setting.updatedAt && (
                      <span className="ml-2">
                        最后更新: {new Date(setting.updatedAt).toLocaleString('zh-CN')}
                      </span>
                    )}
                  </p>
                </label>
              </div>
            ))}
          </div>

          {/* 保存按钮 */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>💡 提示：</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>加密字段（如 API Key）会安全存储</li>
                <li>修改后立即生效，无需重启服务</li>
                <li>优先级：数据库配置 &gt; 环境变量</li>
              </ul>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        {/* 危险操作区域 */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">🚨 安全提示</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            <li>请勿与他人分享 API Keys</li>
            <li>定期轮换敏感密钥</li>
            <li>只有 ADMIN 角色可以访问此页面</li>
            <li>
              数据库备份也会包含加密的设置（需要 SETTINGS_ENCRYPTION_KEY 才能解密）
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
