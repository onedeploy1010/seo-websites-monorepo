'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from '@/components/I18nProvider'

interface Keyword {
  id: string
  keyword: string
  searchEngine: string
  website: {
    id: string
    name: string
  }
  rankings: Array<{
    position: number | null
    createdAt: string
  }>
}

async function fetchKeywords(): Promise<Keyword[]> {
  const response = await fetch('/api/keywords')
  if (!response.ok) throw new Error('Failed to fetch keywords')
  return response.json()
}

export default function KeywordsPage() {
  const t = useTranslations()
  const { data: keywords, isLoading } = useQuery({
    queryKey: ['keywords'],
    queryFn: fetchKeywords,
  })

  const getLatestRanking = (rankings: Keyword['rankings']) => {
    if (rankings.length === 0) return null
    return rankings[0].position
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('keywords.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('keywords.subtitle')}
          </p>
        </div>
        <Link
          href="/keywords/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {t('keywords.add')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      ) : keywords && keywords.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('keywords.table.keyword')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('keywords.table.website')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('keywords.table.searchEngine')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('keywords.table.ranking')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('keywords.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keywords.map((keyword) => {
                const latestRanking = getLatestRanking(keyword.rankings)
                return (
                  <tr key={keyword.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {keyword.website.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {keyword.searchEngine}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {latestRanking ? (
                        <span className="text-sm font-semibold text-gray-900">
                          #{latestRanking}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">{t('keywords.notRanked')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/keywords/${keyword.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {t('keywords.viewDetails')}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-6xl">🔑</span>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {t('keywords.noKeywords')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('keywords.noKeywordsDesc')}
          </p>
          <div className="mt-6">
            <Link
              href="/keywords/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {t('keywords.addFirst')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
