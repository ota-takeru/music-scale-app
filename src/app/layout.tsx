import './globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import ja from '../locales/ja'

export const metadata: Metadata = {
  title: 'Music Scale App',
  description: ja.DESCRIPTIONS_HOME,
  keywords: ja.KEYWORDS,
  openGraph: {
    title: 'Music Scale App',
    description: ja.DESCRIPTIONS_HOME,
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        <Header href="/" title="Music Scale App" />
        {children}
        <Footer />
      </body>
    </html>
  )
}
