import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import type { PianoKeyProps } from '../../types'

/**
 * ピアノキーの基底コンポーネント
 * WhiteKeyとBlackKeyの共通ロジックを統合
 */
const PianoKey: React.FC<PianoKeyProps> = React.memo((props) => {
  const {
    isdown,
    isPrimaryKey,
    setPrimaryKey,
    primaryKey,
    label,
    n,
    keyType,
    musicData,
    setMusicData,
    className = '',
    disabled = false,
  } = props

  const [down, setDown] = useState(isdown)

  // 音符名からデータキーへのマッピング
  const getDataKeyFromLabel = useCallback((label: string) => {
    const mapping: { [key: string]: string } = {
      // 白鍵
      A: 'a',
      B: 'b',
      C: 'c',
      D: 'd',
      E: 'e',
      F: 'f',
      G: 'g',
      // 黒鍵
      'A#': 'a_sharp',
      'C#': 'c_sharp',
      'D#': 'd_sharp',
      'F#': 'f_sharp',
      'G#': 'g_sharp',
    }
    return mapping[label]
  }, [])

  const pressed = useCallback(() => {
    if (disabled || !musicData) return

    const newDown = down === 'false' ? 'true' : 'false'
    setDown(newDown)

    if (setMusicData) {
      const dataKey = getDataKeyFromLabel(label)
      if (dataKey) {
        setMusicData((prev) => ({
          ...prev,
          [dataKey]: newDown === 'true',
        }))
      }
    }

    if (isPrimaryKey === 'true') {
      setPrimaryKey(primaryKey.map(() => 'false'))
    }
  }, [
    disabled,
    down,
    musicData,
    setMusicData,
    label,
    getDataKeyFromLabel,
    isPrimaryKey,
    setPrimaryKey,
    primaryKey,
  ])

  useEffect(() => {
    setDown(isdown)
  }, [isdown])

  // 黒鍵の場合のdata-note属性用の値
  const getDataNoteFromLabel = useCallback((label: string) => {
    const mapping: { [key: string]: string } = {
      'A#': 'a_sharp',
      'C#': 'c_sharp',
      'D#': 'd_sharp',
      'F#': 'f_sharp',
      'G#': 'g_sharp',
    }
    return mapping[label]
  }, [])

  const dataNote = keyType === 'black' ? getDataNoteFromLabel(label) : undefined

  return (
    <div
      className={`${
        keyType === 'white' ? 'white-key' : 'black-key'
      } ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={pressed}
      data-down={down}
      data-primary-key={isPrimaryKey}
      {...(dataNote && { 'data-note': dataNote })}
    >
      <span className="key-label">{label}</span>
    </div>
  )
})

PianoKey.displayName = 'PianoKey'

export default PianoKey
