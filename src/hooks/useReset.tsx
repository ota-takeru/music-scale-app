import { useCallback } from 'react'
import { resetMusicData } from '../utils/musicDataHelpers'
import type { ResetHookProps } from '../types'

interface UseResetReturn {
  resetData: () => void
}

/**
 * 音楽データとピアノキーをリセットするフック
 * 統一的なmusicDataインターフェースを使用
 */
export const useReset = (params: ResetHookProps): UseResetReturn => {
  const resetData = useCallback(() => {
    // 音楽データのリセット
    if (params.musicData && params.setMusicData) {
      const resetData = resetMusicData(params.musicData)
      params.setMusicData(resetData)
    }

    // primaryKeyのリセット
    if (params.primaryKey && params.setPrimaryKey) {
      const resetKeys = new Array(params.primaryKey.length).fill('false')
      params.setPrimaryKey(resetKeys)
    }
  }, [params])

  return { resetData }
}
