'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'

interface SpiderLog {
  id: string
  ip: string
  userAgent: string
  url: string
  bot: string | null
  createdAt: string
  website: {
    name: string
  }
}

interface SpiderStats {
  totalVisits: number
  uniqueBots: number
  topBots: Array<{
    bot: string
    count: number
  }>
  recentVisits: SpiderLog[]
}

async function fetchSpiderStats(timeRange: string = '24h'): Promise<SpiderStats> {
  const response = await fetch(`/api/spider/stats?range=${timeRange}`)
  if (!response.ok) throw new Error('Failed to fetch spider stats')
  return response.json()
}

export default function SpiderPage() {
  const [timeRange, setTimeRange] = useState('24h')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['spider-stats', timeRange],
    queryFn: () => fetchSpiderStats(timeRange),
  })

  const botIcons: Record<string, string> = {
    googlebot: '🔍',
    bingbot: '🦅',
    baiduspider: '🐻',
    yandexbot: '🟥',
    sogou: '🟧',
    '360spider': '🔵',
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spider Pool Monitor</h1>
          <p className="mt-2 text-gray-600">
            Track search engine crawler activity across your websites
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading spider data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                    <span className="text-2xl">🕷️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Visits
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stats?.totalVisits ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Unique Bots
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stats?.uniqueBots ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex-shrink-0 rounded-md bg-purple-500 p-3 inline-flex">
                  <span className="text-2xl">📊</span>
                </div>
                <dl className="mt-2">
                  <dt className="text-sm font-medium text-gray-500">Top Bot</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.topBots[0] ? (
                      <span className="flex items-center">
                        <span className="mr-2">
                          {botIcons[stats.topBots[0].bot.toLowerCase()] || '🤖'}
                        </span>
                        {stats.topBots[0].bot} ({stats.topBots[0].count})
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Bots */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Top Search Engine Crawlers
              </h2>
              {stats?.topBots && stats.topBots.length > 0 ? (
                <div className="space-y-3">
                  {stats.topBots.map((bot, index) => (
                    <div key={bot.bot} className="flex items-center">
                      <span className="text-2xl mr-3">
                        {botIcons[bot.bot.toLowerCase()] || '🤖'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {bot.bot}
                          </span>
                          <span className="text-sm text-gray-500">
                            {bot.count} visits
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${(bot.count / stats.topBots[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No crawler visits recorded
                </p>
              )}
            </div>

            {/* Recent Visits */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Recent Crawler Visits
              </h2>
              {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats.recentVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="border-l-4 border-indigo-500 bg-gray-50 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {botIcons[visit.bot?.toLowerCase() || ''] || '🤖'}{' '}
                          {visit.bot || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(visit.createdAt), 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-600 truncate">{visit.url}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{visit.ip}</span>
                        <span className="text-xs text-gray-500">
                          {visit.website.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent visits
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
