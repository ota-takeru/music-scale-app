import React from 'react'
import ScaleSearch from '../../../components/base'
import type { Metadata } from 'next'
import { fetchAllScaleCombinations } from '../../../api'

interface PageProps {
  params: {
    id: string
  }
}

// 静的ページ生成のためのパラメータ生成
export async function generateStaticParams() {
  try {
    const response = await fetchAllScaleCombinations()

    if (!response.success || !response.data) {
      console.warn('Failed to fetch scale combinations for static generation')
      return []
    }

    return response.data.map((combination) => ({
      id: `${encodeURIComponent(combination.key)}-${encodeURIComponent(
        combination.scale
      )}`,
    }))
  } catch (error) {
    console.error('Error generating static params for scales:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [encodedKey, encodedScale] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const scaleRaw = decodeURIComponent(encodedScale)

  // 英語のスケール名を日本語に変換してタイトル用に使用
  const scaleJapaneseToEnglish: Record<string, string> = {
    メジャー: 'major',
    マイナー: 'minor',
    ハーモニックマイナー: 'harmonic minor',
    メロディックマイナー: 'melodic minor',
    メジャーペンタトニック: 'major pentatonic',
    マイナーペンタトニック: 'minor pentatonic',
  }

  const scaleEnglishToDisplay: Record<string, string> = {
    major: 'Major',
    minor: 'Minor',
    harmonicMinor: 'Harmonic Minor',
    melodicMinor: 'Melodic Minor',
    majorPentatonic: 'Major Pentatonic',
    minorPentatonic: 'Minor Pentatonic',
  }

  // 適切な表示名を取得
  const scaleDisplayName =
    scaleEnglishToDisplay[scaleRaw] ||
    scaleJapaneseToEnglish[scaleRaw] ||
    scaleRaw

  return {
    title: `${key} ${scaleDisplayName} Scale - Music Scale App`,
    description: `Explore the ${key} ${scaleDisplayName} scale with interactive piano and guitar visualization. Learn the notes, chords, and musical theory.`,
    keywords: `${key} ${scaleDisplayName}, music scale, piano, guitar, music theory, ${key} scale`,
    openGraph: {
      title: `${key} ${scaleDisplayName} Scale`,
      description: `Interactive ${key} ${scaleDisplayName} scale with piano and guitar visualization`,
      type: 'website',
    },
  }
}

export default function ScaleDetailPage({ params }: PageProps) {
  const [encodedKey, encodedScale] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const scale = decodeURIComponent(encodedScale)
  const urlArray = [key, scale]

  // デバッグログ
  console.log('ScaleDetailPage params:', params)
  console.log('Generated urlArray:', urlArray)

  return <ScaleSearch urlArray={urlArray} />
}
