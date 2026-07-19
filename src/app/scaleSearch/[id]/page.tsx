import React from 'react'
import ScaleSearch from '../../../components/base'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAllScaleCombinations, fetchKey } from '../../../api'
import {
  buildMusicParamId,
  buildMusicRouteId,
  getScaleDisplayName,
  normalizeScaleValue,
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
    const response = await fetchAllScaleCombinations()

    if (!response.success || !response.data) {
      console.warn('Failed to fetch scale combinations for static generation')
      return []
    }

    return response.data.map((combination) => ({
      id: buildMusicParamId(
        combination.key,
        normalizeScaleValue(combination.scale),
      ),
    }))
  } catch (error) {
    console.error('Error generating static params for scales:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const [key, scaleRaw] = parseMusicRouteId(id)
  const scale = normalizeScaleValue(scaleRaw)
  const scaleDisplayName = getScaleDisplayName(scale)

  return {
    title: `${key} ${scaleDisplayName} Scale - Music Scale App`,
    description: `Explore the ${key} ${scaleDisplayName} scale with interactive piano and guitar visualization. Learn the notes, chords, and musical theory.`,
    keywords: `${key} ${scaleDisplayName}, music scale, piano, guitar, music theory, ${key} scale`,
    openGraph: {
      title: `${key} ${scaleDisplayName} Scale`,
      description: `Interactive ${key} ${scaleDisplayName} scale with piano and guitar visualization`,
      type: 'website',
    },
    alternates: {
      canonical: `/scaleSearch/${buildMusicRouteId(key, scale)}`,
    },
  }
}

export default async function ScaleDetailPage({ params }: PageProps) {
  const { id } = await params
  const [key, scaleRaw] = parseMusicRouteId(id)
  const scale = normalizeScaleValue(scaleRaw)
  const urlArray = [key, scale]
  const response = await fetchKey(key, scale)

  if (!response.success || !response.data?.[0]) {
    notFound()
  }

  return <ScaleSearch urlArray={urlArray} initialData={response.data[0]} />
}
