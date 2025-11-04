'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

interface Sitemap {
  id: string
  url: string
  updatedAt: string
  submittedAt: string | null
  website: {
    id: string
    name: string
    domain: string
  }
}

async function fetchSitemaps(): Promise<Sitemap[]> {
  const response = await fetch('/api/sitemaps')
  if (!response.ok) throw new Error('Failed to fetch sitemaps')
  return response.json()
}

async function generateSitemap(websiteId: string) {
  const response = await fetch(`/api/sitemaps/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ websiteId }),
  })
  if (!response.ok) throw new Error('Failed to generate sitemap')
  return response.json()
}

async function submitSitemap(sitemapId: string, engines: string[]) {
  const response = await fetch(`/api/sitemaps/${sitemapId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ engines }),
  })
  if (!response.ok) throw new Error('Failed to submit sitemap')
  return response.json()
}

export default function SitemapsPage() {
  const queryClient = useQueryClient()

  const { data: sitemaps, isLoading } = useQuery({
    queryKey: ['sitemaps'],
    queryFn: fetchSitemaps,
  })

  const generateMutation = useMutation({
    mutationFn: generateSitemap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemaps'] })
    },
  })

  const submitMutation = useMutation({
    mutationFn: ({ id, engines }: { id: string; engines: string[] }) =>
      submitSitemap(id, engines),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitemaps'] })
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sitemaps</h1>
        <p className="mt-2 text-gray-600">
          Generate and submit sitemaps to search engines
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading sitemaps...</p>
        </div>
      ) : sitemaps && sitemaps.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sitemap URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sitemaps.map((sitemap) => (
                <tr key={sitemap.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sitemap.website.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sitemap.website.domain}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={sitemap.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-900 truncate block max-w-xs"
                    >
                      {sitemap.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sitemap.updatedAt
                      ? format(new Date(sitemap.updatedAt), 'MMM d, yyyy HH:mm')
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sitemap.submittedAt
                      ? format(new Date(sitemap.submittedAt), 'MMM d, yyyy HH:mm')
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => generateMutation.mutate(sitemap.website.id)}
                      disabled={generateMutation.isPending}
                      className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
                    >
                      Generate
                    </button>
                    <button
                      onClick={() =>
                        submitMutation.mutate({
                          id: sitemap.id,
                          engines: ['google', 'bing', 'baidu'],
                        })
                      }
                      disabled={submitMutation.isPending}
                      className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                    >
                      Submit All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-6xl">🗺️</span>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No sitemaps configured
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Sitemaps will be created automatically when you add websites.
          </p>
        </div>
      )}
    </div>
  )
}
