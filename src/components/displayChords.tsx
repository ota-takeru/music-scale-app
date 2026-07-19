import React, { useEffect, useState, useCallback } from 'react'
import { fetchKey, fetchChords } from '../api'
import { useConvertKeyName } from '../hooks/useConvertKeyName'
import { useLocale } from '../hooks/useLocale'
import { useLoading } from '../hooks/useLoading'
import ApiErrorDisplay from './common/ApiErrorDisplay'
import LoadingSpinner from './common/LoadingSpinner'
import Link from 'next/link'
import type { ScaleData, ApiError, NoteName, NoteNameLower } from '../types'

interface DisplayChordsProps {
  array: [string, string] | null
}

interface ChordGroup {
  [key: string]: [string, string][]
}

const DisplayChords: React.FC<DisplayChordsProps> = ({ array }) => {
  const { BigToSmall, SmallToBig } = useConvertKeyName()
  const [displayThreeChords, setDisplayThreeChords] = useState<ChordGroup>({})
  const [displayFourChords, setDisplayFourChords] = useState<ChordGroup>({})
  const [displayOthers, setDisplayOthers] = useState<ChordGroup>({})
  const { isLoading, withLoading } = useLoading(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchKeyData = useCallback(
    async (key: string, scale: string): Promise<string[] | null> => {
      if (!key || !scale) return null

      const response = await fetchKey(key, scale)
      if (!response.success) {
        setError(response.error!)
        return null
      }

      if (response.data && response.data.length > 0) {
        const data = Object.keys(response.data[0]).filter(
          (key) => response.data![0][key as keyof ScaleData]
        )
        data.splice(0, 2)
        return data
      }
      return null
    },
    []
  )

  const fetchChordData = useCallback(
    async (array: string[]): Promise<string[][] | null> => {
      if (!array || array.length === 0) return []

      const response = await fetchChords(array)
      if (!response.success) {
        setError(response.error!)
        return []
      }

      if (response.data) {
        const filteredResponse = response.data
          .map((chord: any) => {
            const trueKeys = Object.keys(chord).filter(
              (key) => chord[key] && key !== 'root' && key !== 'type'
            )
            trueKeys.unshift(
              BigToSmall[chord.root as keyof typeof BigToSmall],
              chord.type
            )
            const filtered = trueKeys.slice(2)
            if (filtered.every((item) => array.includes(item))) {
              return trueKeys
            }
            return null
          })
          .filter(Boolean) as string[][]
        return filteredResponse
      }
      return []
    },
    [BigToSmall]
  )

  const fetchData = useCallback(async () => {
    if (!array || !array[0] || !array[1]) return

    setError(null)

    const fetchProcess = async () => {
      const a = await fetchKeyData(array[0], array[1])
      if (!a) {
        return
      }

      const b = await fetchChordData(a)
      if (a && b) {
        const threeChords: ChordGroup = {}
        const fourChords: ChordGroup = {}
        const others: ChordGroup = {}

        for (let i = 0; i < a.length; i++) {
          for (let j = 0; j < b.length; j++) {
            if (b[j][0] === a[i]) {
              const chordPair: [string, string] = [
                SmallToBig[b[j][0] as keyof typeof SmallToBig],
                b[j][1] || '',
              ]

              if (b[j].length === 5) {
                threeChords[a[i]] = [...(threeChords[a[i]] || []), chordPair]
              } else if (b[j].length === 6) {
                fourChords[a[i]] = [...(fourChords[a[i]] || []), chordPair]
              } else {
                others[a[i]] = [...(others[a[i]] || []), chordPair]
              }
            }
          }
          if (threeChords[a[i]] === undefined) {
            threeChords[a[i]] = []
          }
          if (fourChords[a[i]] === undefined) {
            fourChords[a[i]] = []
          }
          if (others[a[i]] === undefined) {
            others[a[i]] = []
          }
        }

        setDisplayThreeChords(threeChords)
        setDisplayFourChords(fourChords)
        setDisplayOthers(others)
      }
    }

    await withLoading(fetchProcess())
  }, [array, SmallToBig, fetchKeyData, fetchChordData, withLoading])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const { t } = useLocale()

  if (error) {
    return <ApiErrorDisplay error={error} onRetry={fetchData} />
  }

  if (isLoading) {
    return <LoadingSpinner message="コードデータを読み込み中..." />
  }

  const renderChordGroup = (chords: ChordGroup, title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(chords).map(([note, chordList]) => (
          <div key={note} className="bg-gray-50 p-3 rounded">
            <h4 className="font-medium text-sm mb-2">{note}:</h4>
            <div className="space-y-1">
              {chordList.map(([root, type], index) => (
                <Link
                  key={`${root}-${type}-${index}`}
                  href={`/chordSearch/${encodeURIComponent(root)}-${type}`}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  {root}
                  {type === 'major' ? '' : type}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-4">
      {renderChordGroup(displayThreeChords, '三和音')}
      {renderChordGroup(displayFourChords, '四和音')}
      {renderChordGroup(displayOthers, 'その他')}
    </div>
  )
}

export default DisplayChords
