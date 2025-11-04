import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Website 1',
  description: 'SEO-optimized website powered by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">
                {process.env.NEXT_PUBLIC_SITE_NAME || 'Website 1'}
              </div>
              <div className="flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </a>
                <a href="/blog" className="text-gray-700 hover:text-gray-900">
                  Blog
                </a>
                <a href="/about" className="text-gray-700 hover:text-gray-900">
                  About
                </a>
              </div>
            </div>
          </nav>
        </header>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© 2025 {process.env.NEXT_PUBLIC_SITE_NAME || 'Website 1'}. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
