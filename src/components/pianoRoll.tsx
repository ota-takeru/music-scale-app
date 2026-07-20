import React, { useState } from 'react'
import PianoAppearance from './pianoAppearance'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'
import type { PianoRollProps } from '../types'
import { useLocale } from '../hooks/useLocale'

const PianoRoll: React.FC<PianoRollProps> = (props) => {
  const { musicData, setMusicData, className = '' } = props
  const { t } = useLocale()

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
        className={`instrument-layout ${className}`}
      >
        <div className="instrument-visual">
          <div className="piano-container">
            <div className="text-center p-4 text-gray-500">
              {t.DATA_UNAVAILABLE}
            </div>
          </div>
        </div>
        <ResetButton reset={handleReset} className="instrument-reset" />
      </div>
    )
  }

  return (
    <div className={`instrument-layout ${className}`}>
      <div className="instrument-visual">
        <PianoAppearance {...pianoProps} />
      </div>
      <ResetButton reset={handleReset} className="instrument-reset" />
    </div>
  )
}

PianoRoll.displayName = 'PianoRoll'

export default PianoRoll
