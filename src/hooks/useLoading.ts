import { useState, useCallback } from 'react'

interface UseLoadingResult {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  withLoading: <T>(promise: Promise<T>) => Promise<T>
}

/**
 * ローディング状態を管理するカスタムフック
 */
export const useLoading = (initialState: boolean = false): UseLoadingResult => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState)

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      setIsLoading(true)
      try {
        const result = await promise
        return result
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    isLoading,
    setIsLoading,
    withLoading,
  }
}

/**
 * 複数のローディング状態を管理するカスタムフック
 */
export const useMultipleLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  )

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }))
  }, [])

  const withLoading = useCallback(
    async <T>(key: string, promise: Promise<T>): Promise<T> => {
      setLoading(key, true)
      try {
        const result = await promise
        return result
      } finally {
        setLoading(key, false)
      }
    },
    [setLoading]
  )

  const isLoading = useCallback(
    (key: string): boolean => {
      return loadingStates[key] || false
    },
    [loadingStates]
  )

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some((loading) => loading)
  }, [loadingStates])

  return {
    isLoading,
    isAnyLoading,
    setLoading,
    withLoading,
  }
}
