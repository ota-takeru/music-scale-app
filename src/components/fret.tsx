import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useConvertKeyName } from '../hooks/useConvertKeyName'
import type { ScaleData, ChordData, NoteNameLower } from '../types'

interface FretProps {
  isdown: boolean
  setFinaldata: (
    data:
      | ScaleData
      | ChordData
      | ((prev: ScaleData | ChordData) => ScaleData | ChordData)
  ) => void
  label: string
}

const Fret: React.FC<FretProps> = React.memo(
  ({ isdown, setFinaldata, label }) => {
    const [isDisplay, setIsDisplay] = useState(isdown)
    const [displayNames, setDisplayNames] = useState(false)

    const { SmallToBig } = useConvertKeyName()

    const handleClick = useCallback(() => {
      const newDisplay = !isDisplay
      setIsDisplay(newDisplay)
      setFinaldata((prev) => ({
        ...prev,
        [label]: newDisplay,
      }))
    }, [isDisplay, setFinaldata, label])

    const handleMouseOver = useCallback(() => {
      setDisplayNames(true)
    }, [])

    const handleMouseOut = useCallback(() => {
      setDisplayNames(false)
    }, [])

    useEffect(() => {
      setIsDisplay(isdown)
    }, [isdown])

    const displayText = useMemo(() => {
      return isDisplay || displayNames
        ? SmallToBig[label as NoteNameLower] || label
        : null
    }, [isDisplay, displayNames, SmallToBig, label])

    // containerClasses removed - using unified design system classes

    return (
      <div className="fret">
        <div
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          className={`fret-dot ${isDisplay ? 'bg-red-500' : 'bg-transparent'}`}
          data-active={isDisplay}
        >
          <p className="fret-label">{displayText}</p>
        </div>
      </div>
    )
  }
)

Fret.displayName = 'Fret'

export default Fret
