'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format } from 'date-fns'
import { useTranslations } from '@/components/I18nProvider'

interface Website {
  id: string
  name: string
  domain: string
  status: string
  description: string | null
  createdAt: string
  _count: {
    posts: number
    keywords: number
  }
}

async function fetchWebsites(): Promise<Website[]> {
  const response = await fetch('/api/websites')
  if (!response.ok) throw new Error('Failed to fetch websites')
  return response.json()
}

export default function WebsitesPage() {
  const t = useTranslations()
  const { data: websites, isLoading } = useQuery({
    queryKey: ['websites'],
    queryFn: fetchWebsites,
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('websites.title')}</h1>
          <p className="mt-2 text-gray-600">{t('websites.subtitle')}</p>
        </div>
        <Link
          href="/websites/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {t('websites.add')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      ) : websites && websites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-6xl">🌐</span>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {t('websites.noWebsites')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('websites.noWebsitesDesc')}
          </p>
          <div className="mt-6">
            <Link
              href="/websites/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {t('websites.addFirst')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function WebsiteCard({ website }: { website: Website }) {
  const t = useTranslations()
  const statusColor = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  }[website.status] || 'bg-gray-100 text-gray-800'

  return (
    <Link
      href={`/websites/${website.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {website.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{website.domain}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}
        >
          {website.status}
        </span>
      </div>

      {website.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {website.description}
        </p>
      )}

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <span className="mr-1">📝</span>
          {t('websites.postsCount', { count: website._count.posts })}
        </div>
        <div className="flex items-center">
          <span className="mr-1">🔑</span>
          {t('websites.keywordsCount', { count: website._count.keywords })}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {t('websites.created', { date: format(new Date(website.createdAt), 'MMM d, yyyy') })}
      </div>
    </Link>
  )
}
