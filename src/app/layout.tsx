import './globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import ja from '../locales/ja'
import { LocaleProvider } from '../hooks/useLocale'

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
    <html lang="ja" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const locale = localStorage.getItem('music-scale-app-locale');
                if (locale === 'ja' || locale === 'en') document.documentElement.lang = locale;
                const storedTheme = localStorage.getItem('music-scale-app-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = storedTheme === 'dark' || storedTheme === 'light'
                  ? storedTheme
                  : prefersDark ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.style.colorScheme = theme;
              } catch (_) {}
            })()`,
          }}
        />
        <LocaleProvider>
          <Header href="/" title="Music Scale App" />
          {children}
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  )
}
