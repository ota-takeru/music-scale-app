import type { ApiResponse, ApiError } from '../types'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * 成功レスポンスを作成する
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  }
}

/**
 * エラーレスポンスを作成する
 */
export function createErrorResponse<T>(
  message: string,
  code?: string,
  details?: unknown,
  statusCode?: number
): ApiResponse<T> {
  return {
    data: null,
    error: {
      message,
      code,
      details,
      statusCode,
    },
    success: false,
  }
}

/**
 * PostgrestErrorをApiErrorに変換する
 */
export function convertPostgrestError(error: PostgrestError): ApiError {
  return {
    message: error.message || 'Database error occurred',
    code: error.code,
    details: error.details,
    statusCode: 400, // Supabaseエラーは通常400系
  }
}

/**
 * 予期しないエラーをApiErrorに変換する
 */
export function convertUnknownError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      details: error.stack,
      statusCode: 500,
    }
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: error,
    statusCode: 500,
  }
}

/**
 * APIレスポンスのラッパー関数
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<ApiResponse<T>> {
  try {
    const result = await operation()
    return createSuccessResponse(result)
  } catch (error) {
    console.error(`Error in ${operationName}:`, error)

    if (error && typeof error === 'object' && 'message' in error) {
      return createErrorResponse(
        (error as PostgrestError).message || `Error in ${operationName}`,
        (error as PostgrestError).code,
        (error as PostgrestError).details
      )
    }

    const apiError = convertUnknownError(error)
    return createErrorResponse(
      `Unexpected error in ${operationName}`,
      apiError.code,
      apiError.details,
      apiError.statusCode
    )
  }
}
