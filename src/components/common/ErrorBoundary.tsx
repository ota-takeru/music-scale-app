'use client'
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} />
      }

      return (
        <div className="card bg-red-50 border-red-200 max-w-md mx-auto mt-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-red-600 mb-4">
              申し訳ございませんが、予期しないエラーが発生しました。
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary bg-red-600 hover:bg-red-700"
            >
              再試行
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
