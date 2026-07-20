import type { Metadata } from 'next'
import ja from '../locales/ja'
import HomeContent from '../components/homeContent'

export const metadata: Metadata = {
  title: 'Music Scale App',
  description: ja.DESCRIPTIONS_HOME,
  keywords: ja.KEYWORDS,
}

export default function Home() {
  return <HomeContent />
}
