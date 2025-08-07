import React, { useState, useEffect, useMemo, useCallback } from 'react'
// CSS modules removed - using unified Tailwind design system
import { useLocale } from '../hooks/useLocale'

interface KeySelectorProps {
  selectedKey: string
  setSelectedKey: (key: string) => void
  label?: string
}

interface KeyOption {
  value: string
  label: string
}

const KeySelector: React.FC<KeySelectorProps> = React.memo(
  ({ selectedKey, setSelectedKey, label }) => {
    // オプションをメモ化
    const options: KeyOption[] = useMemo(
      () => [
        { value: 'A', label: 'A' },
        { value: 'A#', label: 'A#' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'C#', label: 'C#' },
        { value: 'D', label: 'D' },
        { value: 'D#', label: 'D#' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
        { value: 'F#', label: 'F#' },
        { value: 'G', label: 'G' },
        { value: 'G#', label: 'G#' },
      ],
      []
    )

    const [key, setKey] = useState<string>(selectedKey)
    const { t } = useLocale()

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newKey = e.target.value
        setKey(newKey)
        setSelectedKey(newKey)
      },
      [setSelectedKey]
    )

    useEffect(() => {
      setKey(selectedKey)
    }, [selectedKey])

    // aria-labelをメモ化
    const ariaLabel = useMemo(() => label || 'キーを選択', [label])

    // プレースホルダーテキストをメモ化
    const placeholderText = useMemo(() => {
      return key ? key : label || t.SELECTED_KEY
    }, [key, label, t.SELECTED_KEY])

    // オプションレンダリングをメモ化
    const optionElements = useMemo(
      () =>
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )),
      [options]
    )

    return (
      <div className="flex mr-4 max-sm:mr-5">
        <select
          onChange={handleChange}
          className="selector-dropdown"
          value={key}
          aria-label={ariaLabel}
        >
          <option value="" hidden>
            {placeholderText}
          </option>
          {optionElements}
        </select>
      </div>
    )
  }
)

KeySelector.displayName = 'KeySelector'

export default KeySelector
