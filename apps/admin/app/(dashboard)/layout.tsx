import { Sidebar } from '@/components/Sidebar'
import { I18nProvider } from '@/components/I18nProvider'
import { getLocale, getTranslations } from '@/lib/i18n-utils'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = getLocale()
  const messages = await getTranslations(locale)

  return (
    <I18nProvider messages={messages}>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </I18nProvider>
  )
}
