import React from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'
import { useLocale } from '../hooks/useLocale'

interface ResetButtonProps {
  reset: () => void
  disabled?: boolean
  label?: string
  className?: string
}

const ResetButton: React.FC<ResetButtonProps> = ({
  reset,
  disabled = false,
  label,
  className = '',
}) => {
  const { t } = useLocale()
  const resolvedLabel = label || t.RESET

  return (
    <button
      type="button"
      onClick={reset}
      disabled={disabled}
      aria-label={resolvedLabel}
      title={resolvedLabel}
      className={`btn-reset ${className}`}
    >
      <IconContext.Provider value={{ size: '1.5em' }}>
        <HiOutlineRefresh aria-hidden="true" />
      </IconContext.Provider>
      <span className="reset-button-label">{resolvedLabel}</span>
    </button>
  )
}

export default ResetButton
