import React from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'

interface ResetButtonProps {
  reset: () => void
  disabled?: boolean
  label?: string
  className?: string
}

const ResetButton: React.FC<ResetButtonProps> = ({
  reset,
  disabled = false,
  label = 'リセット',
  className = '',
}) => {
  return (
    <button
      onClick={reset}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`btn-reset ${className}`}
    >
      <IconContext.Provider value={{ size: '1.5em' }}>
        <HiOutlineRefresh />
      </IconContext.Provider>
    </button>
  )
}

export default ResetButton
