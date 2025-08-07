import React, { useState, useEffect, useMemo, useCallback } from 'react'
// CSS modules removed - using unified Tailwind design system
import { useLocale } from '../hooks/useLocale'

interface ChordSelectorProps {
  selectedChord: string
  setSelectedChord: (chord: string) => void
}

interface ChordOption {
  value: string
  label: string
}

const ChordSelector: React.FC<ChordSelectorProps> = React.memo(
  ({ selectedChord, setSelectedChord }) => {
    // オプションをメモ化（定数なので依存関係は空）
    const options: ChordOption[] = useMemo(
      () => [
        { value: 'major', label: 'major' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '7sus4', label: '7sus4' },
        { value: 'maj7', label: 'M7' },
        { value: '9', label: '9' },
        { value: '11', label: '11' },
        { value: '13', label: '13' },
        { value: 'm', label: 'minor' },
        { value: 'm7', label: 'm7' },
        { value: 'm7(b5)', label: 'm7(b5)' },
        { value: 'm9', label: 'm9' },
        { value: 'dim', label: 'dim' },
        { value: 'dim7', label: 'dim7' },
        { value: 'aug', label: 'aug' },
        { value: 'sus4', label: 'sus4' },
      ],
      []
    )

    const [chord, setChord] = useState<string>(selectedChord)
    const { t } = useLocale()

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newChord = e.target.value
        setChord(newChord)
        setSelectedChord(newChord)
      },
      [setSelectedChord]
    )

    useEffect(() => {
      setChord(selectedChord)
    }, [selectedChord])

    // プレースホルダーテキストをメモ化
    const placeholderText = useMemo(() => {
      return chord ? chord : t.SELECTED_CHORD
    }, [chord, t.SELECTED_CHORD])

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
          value={chord}
          aria-label="コードを選択"
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

ChordSelector.displayName = 'ChordSelector'

export default ChordSelector
