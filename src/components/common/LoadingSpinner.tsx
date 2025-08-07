import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IconContext } from 'react-icons'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '読み込み中...',
  size = 'md',
  className = '',
  color = '#007bff',
}) => {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-32',
  }

  const iconSizes = {
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  }

  return (
    <div
      className={`flex justify-center items-center ${sizeClasses[size]} ${className}`}
    >
      <IconContext.Provider value={{ color, size: iconSizes[size] }}>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </IconContext.Provider>
      <span className={`ml-3 ${textSizes[size]}`}>{message}</span>
    </div>
  )
}

export default LoadingSpinner
