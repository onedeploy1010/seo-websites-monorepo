import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DownloadSection from '@/components/DownloadSection'

export const metadata: Metadata = {
  title: 'Telegram 下载',
  description: '下载 Telegram 官方客户端 - 支持 Windows、Mac、Linux、iOS、Android 等全平台',
}

export default function DownloadPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20 bg-gradient-to-br from-telegram-light to-telegram-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">下载 Telegram</h1>
            <p className="text-xl opacity-90">
              全平台支持，随时随地保持连接
            </p>
          </div>
        </div>
      </div>
      <DownloadSection />
      <Footer />
    </main>
  )
}
