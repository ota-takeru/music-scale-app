import React, { useState, useEffect, useMemo, useCallback } from 'react'
// CSS modules removed - using unified Tailwind design system
import { useLocale } from '../hooks/useLocale'
import { useConvertScaleName } from '../hooks/useConvertScaleName'
import type { ScaleType } from '../types'

interface ScaleSelectorProps {
  selectedScale: string
  setSelectedScale: (scale: string) => void
}

interface ScaleOption {
  value: string
  label: string
}

const ScaleSelector: React.FC<ScaleSelectorProps> = React.memo(
  ({ selectedScale, setSelectedScale }) => {
    const convertScale = useConvertScaleName()
    const { t } = useLocale()

    // オプションをメモ化（tに依存）
    const options: ScaleOption[] = useMemo(
      () => [
        { value: 'major', label: t.MAJOR },
        { value: 'minor', label: t.MINOR },
        { value: 'harmonicMinor', label: t.HARMONIC_MINOR },
        { value: 'melodicMinor', label: t.MELODIC_MINOR },
        { value: 'majorPentatonic', label: t.MAJOR_PENTATONIC },
        { value: 'minorPentatonic', label: t.MINOR_PENTATONIC },
      ],
      [t]
    )

    const [scale, setScale] = useState<string>(selectedScale)

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newScale = e.target.value
        setScale(newScale)
        setSelectedScale(newScale)
      },
      [setSelectedScale]
    )

    useEffect(() => {
      setScale(selectedScale)
    }, [selectedScale])

    // プレースホルダーテキストをメモ化
    const placeholderText = useMemo(() => {
      return scale
        ? convertScale[scale as ScaleType] || scale
        : t.SELECTED_SCALE
    }, [scale, convertScale, t.SELECTED_SCALE])

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
          className="selector-scale"
          value={scale}
          aria-label="スケールを選択"
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

ScaleSelector.displayName = 'ScaleSelector'

export default ScaleSelector
