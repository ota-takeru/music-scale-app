'use client'
import React, { useState, lazy, Suspense, useMemo } from 'react'
import { IconContext } from 'react-icons'
import { RxDoubleArrowUp } from 'react-icons/rx'
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
  const [isDisplay, setIsDisplay] = useState(false)

  const handleClick = () => {
    setIsDisplay(!isDisplay)
  }

  // プロップスをメモ化
  const pianoProps = useMemo(
    () => ({
      musicData,
      setMusicData,
    }),
    [musicData, setMusicData]
  )

  const fingerboardProps = useMemo(
    () => ({
      finaldata: musicData || undefined,
      setFinaldata: setMusicData,
    }),
    [musicData, setMusicData]
  )

  // データがない場合の表示
  if (!musicData) {
    return (
      <div className={`w-full text-center p-8 text-gray-500 ${className}`}>
        楽器データが読み込まれていません
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* トグルボタン */}
      <div
        className="flex justify-center items-center cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg mb-4"
        onClick={handleClick}
      >
        <IconContext.Provider value={{ size: '1.5em', color: '#333' }}>
          <div
            className={`transform transition-transform duration-300 ${
              isDisplay ? 'rotate-180' : ''
            }`}
          >
            <RxDoubleArrowUp />
          </div>
        </IconContext.Provider>
        <span className="ml-2 text-lg font-medium">
          {isDisplay ? '楽器を隠す' : '楽器を表示'}
        </span>
      </div>

      {/* 楽器表示エリア */}
      {isDisplay && (
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
      )}
    </div>
  )
}

InstrumentDisplay.displayName = 'InstrumentDisplay'

export default InstrumentDisplay
