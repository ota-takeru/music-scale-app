import React, { useState, useCallback } from 'react'
import type { ApiResponse, ApiError } from '../types'

interface UseApiCallState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiCallReturn<T> extends UseApiCallState<T> {
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

/**
 * API呼び出しのためのカスタムフック
 */
export function useApiCall<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiCallReturn<T> {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await apiFunction(...args)

        if (response.success) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          })
        } else {
          setState({
            data: null,
            loading: false,
            error: response.error,
          })
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: {
            message: 'Unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            details: error,
          },
        })
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * 自動実行機能付きのAPI呼び出しフック
 */
export function useApiCallAuto<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  args: any[],
  deps: React.DependencyList = []
): UseApiCallReturn<T> {
  const apiCall = useApiCall(apiFunction)

  React.useEffect(() => {
    if (args.every((arg) => arg !== undefined && arg !== null && arg !== '')) {
      apiCall.execute(...args)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCall, args, ...deps])

  return apiCall
}
