import type { MusicData, ScaleData, ChordData, MusicNote } from '../types'

/**
 * スケールデータかどうかを判定する
 */
export const isScaleData = (data: MusicData): data is ScaleData => {
  return 'key' in data && 'scale' in data
}

/**
 * コードデータかどうかを判定する
 */
export const isChordData = (data: MusicData): data is ChordData => {
  return 'root' in data && 'type' in data
}

/**
 * 音楽データから有効な音符を取得する
 */
export const getNotesFromData = (data: MusicData): string[] => {
  const noteKeys = [
    'a',
    'a_sharp',
    'b',
    'c',
    'c_sharp',
    'd',
    'd_sharp',
    'e',
    'f',
    'f_sharp',
    'g',
    'g_sharp',
  ] as const
  return noteKeys.filter((key) => data[key] === true)
}

/**
 * 音楽データの全ての音符をfalseにリセットする
 */
export const resetMusicData = (data: MusicData): MusicData => {
  const resetData = { ...data }
  const noteKeys = [
    'a',
    'a_sharp',
    'b',
    'c',
    'c_sharp',
    'd',
    'd_sharp',
    'e',
    'f',
    'f_sharp',
    'g',
    'g_sharp',
  ] as const

  noteKeys.forEach((key) => {
    resetData[key] = false
  })

  return resetData
}

/**
 * 空のスケールデータを作成する
 */
export const createEmptyScaleData = (): ScaleData => {
  return {
    key: '',
    scale: '',
    a: false,
    a_sharp: false,
    b: false,
    c: false,
    c_sharp: false,
    d: false,
    d_sharp: false,
    e: false,
    f: false,
    f_sharp: false,
    g: false,
    g_sharp: false,
  }
}

/**
 * 空のコードデータを作成する
 */
export const createEmptyChordData = (): ChordData => {
  return {
    root: '',
    type: '',
    a: false,
    a_sharp: false,
    b: false,
    c: false,
    c_sharp: false,
    d: false,
    d_sharp: false,
    e: false,
    f: false,
    f_sharp: false,
    g: false,
    g_sharp: false,
  }
}

/**
 * 音楽データに音符が設定されているかチェックする
 */
export const hasActiveNotes = (data: MusicData): boolean => {
  return getNotesFromData(data).length > 0
}

/**
 * 音楽データの音符部分のみを取得する
 */
export const getMusicNoteData = (data: MusicData): MusicNote => {
  return {
    a: data.a,
    a_sharp: data.a_sharp,
    b: data.b,
    c: data.c,
    c_sharp: data.c_sharp,
    d: data.d,
    d_sharp: data.d_sharp,
    e: data.e,
    f: data.f,
    f_sharp: data.f_sharp,
    g: data.g,
    g_sharp: data.g_sharp,
  }
}

/**
 * 音楽データのタイトルを取得する（表示用）
 */
export const getMusicDataTitle = (data: MusicData): string => {
  if (isScaleData(data)) {
    return `${data.key} ${data.scale}`
  } else if (isChordData(data)) {
    return `${data.root}${data.type === 'major' ? '' : data.type}`
  }
  return '不明'
}

/**
 * 音楽データをディープコピーする
 */
export const cloneMusicData = <T extends MusicData>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 音楽データを比較する（音符部分のみ）
 */
export const compareMusicNotes = (
  data1: MusicData,
  data2: MusicData
): boolean => {
  const noteKeys = [
    'a',
    'a_sharp',
    'b',
    'c',
    'c_sharp',
    'd',
    'd_sharp',
    'e',
    'f',
    'f_sharp',
    'g',
    'g_sharp',
  ] as const

  return noteKeys.every((key) => data1[key] === data2[key])
}

/**
 * 音楽データのバリデーション
 */
export const validateMusicData = (
  data: MusicData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (isScaleData(data)) {
    if (!data.key || typeof data.key !== 'string') {
      errors.push('キーが設定されていません')
    }
    if (!data.scale || typeof data.scale !== 'string') {
      errors.push('スケールが設定されていません')
    }
  } else if (isChordData(data)) {
    if (!data.root || typeof data.root !== 'string') {
      errors.push('ルートが設定されていません')
    }
    if (!data.type || typeof data.type !== 'string') {
      errors.push('コードタイプが設定されていません')
    }
  } else {
    errors.push('不正な音楽データ形式です')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
