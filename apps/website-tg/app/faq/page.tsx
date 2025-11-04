import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title: '常见问题 FAQ',
  description: '关于 Telegram 营销服务的常见问题解答，了解我们的服务流程、价格、技术支持等信息',
}

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20 bg-gradient-to-br from-telegram-light to-telegram-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">常见问题</h1>
            <p className="text-xl opacity-90">
              找到您需要的答案，如有其他问题请随时联系我们
            </p>
          </div>
        </div>
      </div>
      <FAQSection />
      <Footer />
    </main>
  )
}
