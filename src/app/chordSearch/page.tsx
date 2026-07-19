import SearchBase from '../../components/common/SearchBase'
import type { Metadata } from 'next'
import ja from '../../locales/ja'

export const metadata: Metadata = {
  title: 'コード検索 - Music Scale App',
  description: ja.DESCRIPTION_CHORD,
  keywords: ja.KEYWORDS,
}

export default function ChordSearchPage() {
  return <SearchBase urlArray={[]} searchType="chord" />
}
