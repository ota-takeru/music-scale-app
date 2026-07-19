'use client'
import React, { lazy, Suspense, useMemo } from 'react'
import type { InstrumentDisplayProps } from '../../types'

// 動的インポートでコード分割
const PianoRoll = lazy(() => import('../pianoRoll'))
const Fingerboard = lazy(() => import('../fingerBoard'))

// ローディングスピナー
const LoadingSpinner: React.FC<{ children: string }> = ({ children }) => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    <span className="ml-2">{children}を読み込み中...</span>
  </div>
)

const InstrumentDisplay: React.FC<InstrumentDisplayProps> = (props) => {
  const { musicData, setMusicData, className = '' } = props

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
        className={`instrument-display w-full text-center p-8 text-gray-500 ${className}`}
        data-testid="instrument-display"
      >
        楽器データが読み込まれていません
      </div>
    )
  }

  return (
    <div
      className={`instrument-display w-full ${className}`}
      data-testid="instrument-display"
    >
      {/* 楽器表示エリア */}
      <div className="space-y-6">
        {/* ピアノロール */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">ピアノ</h3>
          <Suspense fallback={<LoadingSpinner>ピアノ</LoadingSpinner>}>
            <PianoRoll {...pianoProps} />
          </Suspense>
        </div>

        {/* ギターフィンガーボード */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">ギター</h3>
          <Suspense fallback={<LoadingSpinner>ギター</LoadingSpinner>}>
            <Fingerboard {...fingerboardProps} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

InstrumentDisplay.displayName = 'InstrumentDisplay'

export default InstrumentDisplay
