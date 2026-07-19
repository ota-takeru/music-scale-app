// CSS modules removed - using unified Tailwind design system
import { useEffect, useState, useCallback, useMemo } from 'react'
import WhiteKey from './whiteKey'
import BlackKey from './blackKey'
import React from 'react'
import type { PianoAppearanceProps, MusicData } from '../types'
import { isScaleData, isChordData } from '../utils/musicDataHelpers'

const PianoAppearance: React.FC<PianoAppearanceProps> = React.memo((props) => {
  const {
    primaryKey,
    setPrimaryKey,
    musicData,
    setMusicData,
    className = '',
  } = props

  const keyList = useMemo(
    () => ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    []
  )

  // 現在のキーを取得する関数
  const getCurrentKey = useCallback(() => {
    if (!musicData) return null

    if (isScaleData(musicData)) {
      return musicData.key
    }
    if (isChordData(musicData)) {
      return musicData.root
    }
    return null
  }, [musicData])

  // データが存在するかチェック
  const hasValidData = useMemo(() => {
    return Boolean(musicData)
  }, [musicData])

  const currentKey = getCurrentKey()

  const updatePrimaryKey = useCallback(() => {
    if (currentKey && setPrimaryKey && primaryKey) {
      const newPrimaryKey = primaryKey.map((item, index) =>
        index === keyList.findIndex((item) => item === currentKey)
          ? 'true'
          : 'false'
      )
      setPrimaryKey(newPrimaryKey)
    }
  }, [currentKey, setPrimaryKey, primaryKey, keyList])

  useEffect(() => {
    updatePrimaryKey()
  }, [updatePrimaryKey])

  // 音符名とデータのキーのマッピング
  const noteToDataKey = useMemo(
    () => ({
      A: 'a',
      'A#': 'a_sharp',
      B: 'b',
      C: 'c',
      'C#': 'c_sharp',
      D: 'd',
      'D#': 'd_sharp',
      E: 'e',
      F: 'f',
      'F#': 'f_sharp',
      G: 'g',
      'G#': 'g_sharp',
    }),
    []
  )

  // キーコンポーネントのプロップスを準備
  const getKeyProps = useCallback(
    (keyName: string, index: number) => {
      const dataKey = noteToDataKey[keyName as keyof typeof noteToDataKey]
      const isdown = musicData?.[dataKey as keyof MusicData] ? 'true' : 'false'
      const isPrimaryKey = primaryKey[index] || 'false'

      return {
        isdown,
        isPrimaryKey,
        setPrimaryKey,
        primaryKey,
        label: keyName,
        n: index,
        musicData,
        setMusicData,
      }
    },
    [musicData, primaryKey, setPrimaryKey, noteToDataKey, setMusicData]
  )

  // 早期return（すべてのフックの後）
  if (!hasValidData) {
    return (
      <div className={`piano-container ${className}`}>
        データが読み込まれていません
      </div>
    )
  }

  return (
    <div className={`piano-container ${className}`}>
      <div className="piano-wrap">
        <div className="white-keys-container">
          {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((keyName) => {
            const index = keyList.indexOf(keyName)
            return <WhiteKey key={keyName} {...getKeyProps(keyName, index)} />
          })}
        </div>
        <div className="black-keys-container">
          {['C#', 'D#', 'F#', 'G#', 'A#'].map((keyName) => {
            const index = keyList.indexOf(keyName)
            return <BlackKey key={keyName} {...getKeyProps(keyName, index)} />
          })}
        </div>
      </div>
    </div>
  )
})

PianoAppearance.displayName = 'PianoAppearance'

export default PianoAppearance
