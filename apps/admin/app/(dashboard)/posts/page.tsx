'use client'

import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  createdAt: string
  website: {
    id: string
    name: string
  }
  syncedWebsites: string[]
}

async function fetchPosts(websiteId?: string): Promise<Post[]> {
  const url = websiteId ? `/api/posts?websiteId=${websiteId}` : '/api/posts'
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

function PostsContent() {
  const searchParams = useSearchParams()
  const websiteId = searchParams.get('website')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', websiteId],
    queryFn: () => fetchPosts(websiteId || undefined),
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-gray-600">
            Manage and synchronize your blog content
          </p>
        </div>
        <Link
          href="/posts/create"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Create Post
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Synced
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {post.website.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {post.syncedWebsites.length} websites
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/posts/${post.id}/sync`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Sync
                    </Link>
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-6xl">📝</span>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No posts</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new blog post.
          </p>
          <div className="mt-6">
            <Link
              href="/posts/create"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create your first post
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading posts...</p>
      </div>
    }>
      <PostsContent />
    </Suspense>
  )
}
