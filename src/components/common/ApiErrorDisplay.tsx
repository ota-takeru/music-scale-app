import React from 'react'
import type { ApiError } from '../../types'

interface ApiErrorDisplayProps {
  error: ApiError
  onRetry?: () => void
  className?: string
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-red-800 font-medium text-sm mb-1">
            エラーが発生しました
          </h3>
          <p className="text-red-600 text-sm mb-2">{error.message}</p>
          {error.code && (
            <p className="text-red-500 text-xs">エラーコード: {error.code}</p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
          >
            再試行
          </button>
        )}
      </div>
    </div>
  )
}

export default ApiErrorDisplay
