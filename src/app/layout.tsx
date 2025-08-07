import './globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'

// 動的インポートでBrowserLoggerをコード分割
const BrowserLogger = lazy(() => import('../components/BrowserLogger'))

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        {/* BrowserLoggerは開発用なので非同期ロード */}
        <Suspense fallback={null}>
          <BrowserLogger />
        </Suspense>
        <Header href="/" title="Music Scale App" />
        {children}
        <Footer />
      </body>
    </html>
  )
}
