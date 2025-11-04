import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogList from '@/components/BlogList'

export const metadata: Metadata = {
  title: '博客文章',
  description: 'Telegram 营销技巧、行业资讯、成功案例分享 - 帮助您更好地运营 Telegram 频道',
}

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20 bg-gradient-to-br from-telegram-light to-telegram-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">博客文章</h1>
            <p className="text-xl opacity-90">
              最新的 Telegram 营销资讯、技巧和成功案例
            </p>
          </div>
        </div>
      </div>
      <BlogList />
      <Footer />
    </main>
  )
}
