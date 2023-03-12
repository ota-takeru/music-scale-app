import React, { useState, useEffect } from 'react'
import Styles from '../styles/selectDiv.module.css'
import { useLocale } from '../hooks/useLocale'
import { useConvertScaleName } from '../hooks/useConvertScaleName'

const ScaleSelector = (props) => {
  const convertScale = useConvertScaleName()
  const { t } = useLocale()
  const options = [
    { value: 'major', label: t.MAJOR },
    { value: 'minor', label: t.MINOR },
    { value: 'harmonicMinor', label: t.HARMONIC_MINOR },
    { value: 'melodicMinor', label: t.MELODIC_MINOR },
    { value: 'majorPentatonic', label: t.MAJOR_PENTATONIC },
    { value: 'minorPentatonic', label: t.MINOR_PENTATONIC },
  ]
  const [scale, setScale] = useState(props.selectedScale)
  const handleChange = (e) => {
    setScale(e.target.value)
    props.setSelectedScale(e.target.value)
  }

  useEffect(() => {
    setScale(props.selectedScale)
  }, [props.selectedScale])

  return (
    <div className={Styles.container}>
      <select
        onChange={handleChange}
        className={Styles.scaleSelector}
        defaultValue={scale}
        label={scale}
      >
        <option value="" hidden>
          {scale ? convertScale[scale] : t.SELECTED_SCALE}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ScaleSelector
