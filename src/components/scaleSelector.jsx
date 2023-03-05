import React from 'react'
import { useState } from 'react'
import Styles from '../styles/selectDiv.module.css'
import { useLocale } from '../hooks/useLocale'

const ScaleSelector = (props) => {
  const [scale, setScale] = useState('')
  const { t } = useLocale()
  const options = [
    { value: 'major', label: t.MAJOR },
    { value: 'minor', label: t.MINOR },
    { value: 'harmonic-minor', label: t.HARMONIC_MINOR },
    { value: 'melodic-minor', label: t.MELODIC_MINOR },
    { value: 'major-pentatonic', label: t.MAJOR_PENTATONIC },
    { value: 'minor-pentatonic', label: t.MINOR_PENTATONIC },
  ]

  const handleChange = (e) => {
    setScale(e.target.value)
    props.setSelectedScale(e.target.value)
  }

  return (
    <div className={Styles.container}>
      <select
        onChange={handleChange}
        defaultValue={{ label: t.SELECTED_SCALE, value: scale }}
        className={Styles.scaleSelector}
      >
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
