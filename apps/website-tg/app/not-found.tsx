import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-9xl">😕</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">页面未找到</h2>
          <p className="text-xl text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="bg-telegram-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-telegram-dark transition"
            >
              返回首页
            </Link>
            <Link
              href="/blog"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              查看博客
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
