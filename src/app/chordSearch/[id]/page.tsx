import React from 'react'
import ChordSearch from '../../../components/baseChord'
import type { Metadata } from 'next'
import { fetchAllChordCombinations } from '../../../api'

interface PageProps {
  params: {
    id: string
  }
}

// 静的ページ生成のためのパラメータ生成
export async function generateStaticParams() {
  try {
    const response = await fetchAllChordCombinations()

    if (!response.success || !response.data) {
      console.warn('Failed to fetch chord combinations for static generation')
      return []
    }

    return response.data.map((combination) => ({
      id: `${encodeURIComponent(combination.root)}-${encodeURIComponent(
        combination.type
      )}`,
    }))
  } catch (error) {
    console.error('Error generating static params for chords:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [encodedKey, encodedChord] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const chordRaw = decodeURIComponent(encodedChord)

  // コード名を適切な表示名に変換
  const chordDisplayNames: Record<string, string> = {
    major: 'Major',
    minor: 'Minor',
    major7: 'Major 7th',
    minor7: 'Minor 7th',
    dominant7: 'Dominant 7th',
    diminished: 'Diminished',
    augmented: 'Augmented',
  }

  const chordDisplayName = chordDisplayNames[chordRaw] || chordRaw

  return {
    title: `${key} ${chordDisplayName} Chord - Music Scale App`,
    description: `Explore the ${key} ${chordDisplayName} chord with interactive piano and guitar visualization. Learn chord progressions and music theory.`,
    keywords: `${key} ${chordDisplayName}, music chord, piano chord, guitar chord, music theory, ${key} chord`,
    openGraph: {
      title: `${key} ${chordDisplayName} Chord`,
      description: `Interactive ${key} ${chordDisplayName} chord with piano and guitar visualization`,
      type: 'website',
    },
  }
}

export default function ChordDetailPage({ params }: PageProps) {
  const [encodedKey, encodedChord] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const chord = decodeURIComponent(encodedChord)
  const urlArray = [key, chord]

  return <ChordSearch urlArray={urlArray} />
}
