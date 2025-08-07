import { useState, useCallback, useMemo } from 'react'
import type { MusicData, ScaleData, ChordData } from '../types'
import {
  isScaleData,
  isChordData,
  createEmptyScaleData,
  createEmptyChordData,
  resetMusicData,
  cloneMusicData,
  hasActiveNotes,
  getMusicDataTitle,
} from '../utils/musicDataHelpers'

export type MusicDataMode = 'scale' | 'chord'

interface UseMusicDataParams {
  mode: MusicDataMode
  initialData?: MusicData
}

interface UseMusicDataReturn {
  // データ
  musicData: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void

  // 型安全なアクセサー
  scaleData: ScaleData | null
  chordData: ChordData | null

  // ユーティリティ
  resetData: () => void
  hasNotes: boolean
  title: string
  mode: MusicDataMode

  // 音符操作
  toggleNote: (noteKey: keyof MusicData) => void
  setNote: (noteKey: keyof MusicData, value: boolean) => void
  setMultipleNotes: (notes: Partial<MusicData>) => void
}

/**
 * 統一的な音楽データ管理フック
 * finaldataとfinalchordの二重管理を解決し、単一のMusicDataで管理
 */
export const useMusicData = ({
  mode,
  initialData,
}: UseMusicDataParams): UseMusicDataReturn => {
  // 初期データの設定
  const getInitialData = useCallback((): MusicData => {
    if (initialData) {
      return cloneMusicData(initialData)
    }
    return mode === 'scale' ? createEmptyScaleData() : createEmptyChordData()
  }, [mode, initialData])

  const [musicData, setMusicData] = useState<MusicData>(getInitialData)

  // 型安全なアクセサー
  const scaleData = useMemo((): ScaleData | null => {
    console.log('🔍 useMusicData - musicData:', musicData)
    console.log('🔍 isScaleData結果:', isScaleData(musicData))
    if (musicData) {
      console.log('🔍 musicDataのキー:', Object.keys(musicData))
      console.log('🔍 keyプロパティ:', 'key' in musicData)
      console.log('🔍 scaleプロパティ:', 'scale' in musicData)
    }
    return isScaleData(musicData) ? musicData : null
  }, [musicData])

  const chordData = useMemo((): ChordData | null => {
    console.log('🔍 useMusicData - chordData判定:', isChordData(musicData))
    return isChordData(musicData) ? musicData : null
  }, [musicData])

  // データリセット
  const resetData = useCallback(() => {
    setMusicData((prev) => resetMusicData(prev))
  }, [])

  // 音符の操作
  const toggleNote = useCallback((noteKey: keyof MusicData) => {
    setMusicData((prev) => ({
      ...prev,
      [noteKey]: !prev[noteKey],
    }))
  }, [])

  const setNote = useCallback((noteKey: keyof MusicData, value: boolean) => {
    setMusicData((prev) => ({
      ...prev,
      [noteKey]: value,
    }))
  }, [])

  const setMultipleNotes = useCallback((notes: Partial<MusicData>) => {
    setMusicData((prev) => ({
      ...prev,
      ...notes,
    }))
  }, [])

  // 計算されたプロパティ
  const hasNotes = useMemo(() => hasActiveNotes(musicData), [musicData])
  const title = useMemo(() => getMusicDataTitle(musicData), [musicData])

  return {
    musicData,
    setMusicData,
    scaleData,
    chordData,
    resetData,
    hasNotes,
    title,
    mode,
    toggleNote,
    setNote,
    setMultipleNotes,
  }
}

/**
 * スケール専用のuseMusicDataラッパー
 */
export const useScaleData = (initialData?: ScaleData) => {
  return useMusicData({ mode: 'scale', initialData })
}

/**
 * コード専用のuseMusicDataラッパー
 */
export const useChordData = (initialData?: ChordData) => {
  return useMusicData({ mode: 'chord', initialData })
}
