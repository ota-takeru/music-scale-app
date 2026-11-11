import SearchBase from '../../components/common/SearchBase'
import type { Metadata } from 'next'
import ja from '../../locales/ja'

export const metadata: Metadata = {
  alternates: { canonical: '/scaleSearch' },
  title: 'スケール検索 - Music Scale App',
  description: ja.DESCRIPTION_SCALE,
  keywords: ja.KEYWORDS,
}

export default function ScaleSearchPage() {
  return <SearchBase urlArray={[]} searchType="scale" />
}
