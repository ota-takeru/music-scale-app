import supabase from '../utils/supabase'
import { withErrorHandling } from '../utils/apiHelpers'
import type {
  ScaleData,
  ChordData,
  ApiResult,
  MusicNote,
  ApiResponse,
} from '../types'
import type { Database } from '../types/database'

// 型エイリアス
type KeyRow = Database['public']['Tables']['key']['Row']
type ChordRow = Database['public']['Tables']['chords']['Row']

/**
 * キーとスケールでスケールデータを取得
 */
export async function fetchKey(
  key: string,
  scale: string
): Promise<ApiResponse<ScaleData[]>> {
  return withErrorHandling(async () => {
    if (!key || !scale) {
      throw new Error('Key and scale parameters are required')
    }

    const { data, error } = await supabase
      .from('key')
      .select('*')
      .eq('key', key)
      .eq('scale', scale)

    if (error) {
      throw error
    }

    return (data as KeyRow[]) || []
  }, 'fetchKey')
}

/**
 * 音符データでスケールを検索
 */
export async function fetchKeyWithNote(
  prevArray: MusicNote
): Promise<ApiResponse<ScaleData[] | undefined>> {
  return withErrorHandling(async () => {
    if (!prevArray) {
      throw new Error('Music note array is required')
    }

    const array = { ...prevArray }
    const keys = Object.keys(array)
    const lastTwoKeys = keys.splice(0, 2)

    const deleteKeys = (array: any, keys: string[]) => {
      const newArray = { ...array }
      keys.forEach((key) => {
        delete newArray[key]
      })
      return newArray
    }

    const keyList = { ...deleteKeys(array, lastTwoKeys) }

    // すべての値がfalseの場合は未定義を返す
    if (Object.values(keyList).every((v) => v !== true)) {
      return undefined
    }

    let query = supabase.from('key').select('*')

    Object.keys(keyList).forEach((key) => {
      if (keyList[key] === true) {
        query = query.eq(key, true)
      }
    })

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data as KeyRow[]) || []
  }, 'fetchKeyWithNote')
}

/**
 * ルートとタイプでコードデータを取得
 */
export async function fetchChordsWithName(
  key: string,
  type: string
): Promise<ApiResponse<ChordData[]>> {
  return withErrorHandling(async () => {
    if (!key || !type) {
      throw new Error('Key and type parameters are required')
    }

    const { data, error } = await supabase
      .from('chords')
      .select('*')
      .eq('root', key)
      .eq('type', type)

    if (error) {
      throw error
    }

    return (data as ChordRow[]) || []
  }, 'fetchChordsWithName')
}

/**
 * 音符配列でコードを検索
 */
export async function fetchChords(
  array: string[]
): Promise<ApiResponse<ChordData[]>> {
  return withErrorHandling(async () => {
    if (!array || array.length === 0) {
      throw new Error('Note array is required and cannot be empty')
    }

    let query = supabase.from('chords').select('*')

    array.forEach((note) => {
      if (note && typeof note === 'string') {
        query = query.eq(note, true)
      }
    })

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data as ChordRow[]) || []
  }, 'fetchChords')
}

/**
 * 音符データでコードを検索
 */
export async function fetchChordsWithNote(
  prevArray: MusicNote
): Promise<ApiResponse<ChordData[] | undefined>> {
  return withErrorHandling(async () => {
    if (!prevArray) {
      throw new Error('Music note array is required')
    }

    const array = { ...prevArray }
    const keys = Object.keys(array)
    const lastTwoKeys = keys.splice(0, 2)

    const deleteKeys = (array: any, keys: string[]) => {
      const newArray = { ...array }
      keys.forEach((key) => {
        delete newArray[key]
      })
      return newArray
    }

    const keyList = { ...deleteKeys(array, lastTwoKeys) }

    // rootとtype以外がすべてfalseの場合は未定義を返す
    const rangeArr = Object.values(keyList)
    if (rangeArr.every((element) => element === false)) {
      return undefined
    }

    let query = supabase.from('chords').select('*')

    Object.keys(keyList).forEach((key) => {
      if (keyList[key] === true) {
        query = query.eq(key, true)
      }
    })

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data as ChordRow[]) || []
  }, 'fetchChordsWithNote')
}

/**
 * 従来のAPI互換性のための関数（戻り値を直接データにする）
 * 新しいコードでは上記の関数を使用することを推奨
 */

export const fetchKeyLegacy = async (
  key: string,
  scale: string
): Promise<ScaleData[]> => {
  const response = await fetchKey(key, scale)
  return response.data || []
}

export const fetchKeyWithNoteLegacy = async (
  prevArray: MusicNote
): Promise<ScaleData[] | undefined> => {
  const response = await fetchKeyWithNote(prevArray)
  return response.data || undefined
}

export const fetchChordsWithNameLegacy = async (
  key: string,
  type: string
): Promise<ChordData[]> => {
  const response = await fetchChordsWithName(key, type)
  return response.data || []
}

export const fetchChordsLegacy = async (
  array: string[]
): Promise<ChordData[]> => {
  const response = await fetchChords(array)
  return response.data || []
}

export const fetchChordsWithNoteLegacy = async (
  prevArray: MusicNote
): Promise<ChordData[] | undefined> => {
  const response = await fetchChordsWithNote(prevArray)
  return response.data || undefined
}

/**
 * 静的ページ生成用：全スケール組み合わせを取得
 */
export async function fetchAllScaleCombinations(): Promise<
  ApiResponse<{ key: string; scale: string }[]>
> {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('key')
      .select('key, scale')
      .order('key')
      .order('scale')

    if (error) {
      throw error
    }

    return (
      data?.map((item: any) => ({
        key: item.key,
        scale: item.scale,
      })) || []
    )
  }, 'fetchAllScaleCombinations')
}

/**
 * 静的ページ生成用：全コード組み合わせを取得
 */
export async function fetchAllChordCombinations(): Promise<
  ApiResponse<{ root: string; type: string }[]>
> {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('chords')
      .select('root, type')
      .order('root')
      .order('type')

    if (error) {
      throw error
    }

    return (
      data?.map((item: any) => ({
        root: item.root,
        type: item.type,
      })) || []
    )
  }, 'fetchAllChordCombinations')
}
