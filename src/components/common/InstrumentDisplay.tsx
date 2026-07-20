'use client'
import React, { lazy, Suspense, useMemo } from 'react'
import type { InstrumentDisplayProps } from '../../types'
import { useLocale } from '../../hooks/useLocale'

// 動的インポートでコード分割
const PianoRoll = lazy(() => import('../pianoRoll'))
const Fingerboard = lazy(() => import('../fingerBoard'))

// ローディングスピナー
const LoadingSpinner: React.FC<{ children: string }> = ({ children }) => {
  const { t } = useLocale()
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="ml-2">
        {children} {t.LOADING}
      </span>
    </div>
  )
}

const InstrumentDisplay: React.FC<InstrumentDisplayProps> = (props) => {
  const { musicData, setMusicData, className = '' } = props
  const { t } = useLocale()

  // プロップスをメモ化
  const pianoProps = useMemo(
    () => ({
      musicData,
      setMusicData,
    }),
    [musicData, setMusicData],
  )

  const fingerboardProps = useMemo(
    () => ({
      finaldata: musicData || undefined,
      setFinaldata: setMusicData,
    }),
    [musicData, setMusicData],
  )

  // データがない場合の表示
  if (!musicData) {
    return (
      <div
        className={`instrument-display search-panel w-full ${className}`}
        data-testid="instrument-display"
      >
        <div className="search-panel-header">
          <h2>{t.INSTRUMENT}</h2>
        </div>
        <div className="search-panel-body instrument-display-empty">
          {t.DATA_UNAVAILABLE}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`instrument-display search-panel w-full ${className}`}
      data-testid="instrument-display"
    >
      <div className="search-panel-header">
        <h2>{t.INSTRUMENT}</h2>
      </div>
      <div className="search-panel-body instrument-display-body">
        <div className="instrument-sections">
          <section className="instrument-section" aria-labelledby="piano-heading">
            <div className="instrument-section-header">
              <h3 id="piano-heading">{t.PIANO}</h3>
            </div>
            <div className="instrument-section-body">
              <Suspense fallback={<LoadingSpinner>{t.PIANO}</LoadingSpinner>}>
                <PianoRoll {...pianoProps} />
              </Suspense>
            </div>
          </section>

          <section
            className="instrument-section"
            aria-labelledby="guitar-heading"
          >
            <div className="instrument-section-header">
              <h3 id="guitar-heading">{t.GUITAR}</h3>
            </div>
            <div className="instrument-section-body">
              <Suspense fallback={<LoadingSpinner>{t.GUITAR}</LoadingSpinner>}>
                <Fingerboard {...fingerboardProps} />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

InstrumentDisplay.displayName = 'InstrumentDisplay'

export default InstrumentDisplay
