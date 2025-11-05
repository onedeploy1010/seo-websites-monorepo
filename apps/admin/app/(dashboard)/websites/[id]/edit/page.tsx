'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface Website {
  id: string
  name: string
  domain: string
  description: string | null
  status: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string[]
  gaId: string | null
  gscId: string | null
  baiduTongjiId: string | null
}

async function fetchWebsite(id: string): Promise<Website> {
  const response = await fetch(`/api/websites/${id}`)
  if (!response.ok) throw new Error('Failed to fetch website')
  return response.json()
}

async function updateWebsite(id: string, data: Partial<Website>) {
  const response = await fetch(`/api/websites/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update website')
  return response.json()
}

export default function EditWebsitePage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const id = params.id as string

  const { data: website, isLoading } = useQuery({
    queryKey: ['website', id],
    queryFn: () => fetchWebsite(id),
  })

  const [formData, setFormData] = useState<Partial<Website>>({})

  const mutation = useMutation({
    mutationFn: (data: Partial<Website>) => updateWebsite(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', id] })
      queryClient.invalidateQueries({ queryKey: ['websites'] })
      router.push(`/websites/${id}`)
    },
  })

  if (isLoading || !website) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const currentData = { ...website, ...formData }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Website</h1>
        <p className="mt-2 text-gray-600">Update website configuration and SEO settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                defaultValue={website.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                defaultValue={website.domain}
                onChange={(e) => handleChange('domain', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                defaultValue={website.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                defaultValue={website.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">SEO Title</label>
              <input
                type="text"
                defaultValue={website.seoTitle || ''}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SEO Description</label>
              <textarea
                defaultValue={website.seoDescription || ''}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SEO Keywords (comma-separated)
              </label>
              <input
                type="text"
                defaultValue={website.seoKeywords.join(', ')}
                onChange={(e) => handleChange('seoKeywords', e.target.value.split(',').map(k => k.trim()))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
              <input
                type="text"
                defaultValue={website.gaId || ''}
                onChange={(e) => handleChange('gaId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Google Search Console ID</label>
              <input
                type="text"
                defaultValue={website.gscId || ''}
                onChange={(e) => handleChange('gscId', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Baidu Tongji ID</label>
              <input
                type="text"
                defaultValue={website.baiduTongjiId || ''}
                onChange={(e) => handleChange('baiduTongjiId', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {mutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Failed to update website. Please try again.</p>
          </div>
        )}
      </form>
    </div>
  )
}
