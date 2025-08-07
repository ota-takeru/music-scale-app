import React, { useState } from 'react'
import PianoAppearance from './pianoAppearance'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'
import type { PianoRollProps } from '../types'

const PianoRoll: React.FC<PianoRollProps> = (props) => {
  const { musicData, setMusicData, className = '' } = props

  const [primaryKey, setPrimaryKey] = useState<string[]>([
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
  ])

  // リセット用のプロップス
  const resetProps = {
    musicData,
    setMusicData,
    primaryKey,
    setPrimaryKey,
  }

  // PianoAppearance用のプロップス
  const pianoProps = {
    primaryKey,
    setPrimaryKey,
    musicData,
    setMusicData,
  }

  const { resetData } = useReset(resetProps)

  const handleReset = () => {
    resetData()
  }

  // データがない場合の表示
  if (!musicData) {
    return (
      <div
        className={`flex mb-5 max-sm:flex-col max-sm:items-center max-sm:m-0 ${className}`}
      >
        <div className="piano-container">
          <div className="text-center p-4 text-gray-500">
            ピアノデータが読み込まれていません
          </div>
        </div>
        <ResetButton reset={handleReset} />
      </div>
    )
  }

  return (
    <div
      className={`flex mb-5 max-sm:flex-col max-sm:items-center max-sm:m-0 ${className}`}
    >
      <PianoAppearance {...pianoProps} />
      <ResetButton reset={handleReset} />
    </div>
  )
}

PianoRoll.displayName = 'PianoRoll'

export default PianoRoll
