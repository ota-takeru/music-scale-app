import React from 'react'
import ChordSearch from '../../../components/baseChord'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAllChordCombinations, fetchChordsWithName } from '../../../api'
import {
  buildMusicParamId,
  buildMusicRouteId,
  getChordDisplayName,
  parseMusicRouteId,
} from '../../../utils/musicRoutes'

export const revalidate = 86400
export const dynamicParams = true

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// DBの組み合わせを事前生成し、以後はISRでゆるく更新する
export async function generateStaticParams() {
  try {
    const response = await fetchAllChordCombinations()

    if (!response.success || !response.data) {
      console.warn('Failed to fetch chord combinations for static generation')
      return []
    }

    return response.data.map((combination) => ({
      id: buildMusicParamId(combination.root, combination.type),
    }))
  } catch (error) {
    console.error('Error generating static params for chords:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const [key, chord] = parseMusicRouteId(id)
  const chordDisplayName = getChordDisplayName(chord)

  return {
    title: `${key} ${chordDisplayName} Chord - Music Scale App`,
    description: `Explore the ${key} ${chordDisplayName} chord with interactive piano and guitar visualization. Learn chord progressions and music theory.`,
    keywords: `${key} ${chordDisplayName}, music chord, piano chord, guitar chord, music theory, ${key} chord`,
    openGraph: {
      title: `${key} ${chordDisplayName} Chord`,
      description: `Interactive ${key} ${chordDisplayName} chord with piano and guitar visualization`,
      type: 'website',
    },
    alternates: {
      canonical: `/chordSearch/${buildMusicRouteId(key, chord)}`,
    },
  }
}

export default async function ChordDetailPage({ params }: PageProps) {
  const { id } = await params
  const [key, chord] = parseMusicRouteId(id)
  const urlArray = [key, chord]
  const response = await fetchChordsWithName(key, chord)

  if (!response.success || !response.data?.[0]) {
    notFound()
  }

  return <ChordSearch urlArray={urlArray} initialData={response.data[0]} />
}
