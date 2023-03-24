import React from 'react'
import { useState, useEffect } from 'react'
import Styles from '../styles/selectDiv.module.css'
import { useLocale } from '../hooks/useLocale'

const ChordSelector = (props) => {
  const options = [
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
  ]
  const [chord, setChord] = useState(props.selectedChord)

  const handleChange = (e) => {
    setChord(e.target.value)
    props.setSelectedChord(e.target.value)
  }

  useEffect(() => {
    setChord(props.selectedChord)
  }, [props.selectedChord])

  const { t } = useLocale()
  return (
    <div className={Styles.container}>
      <select
        onChange={handleChange}
        className={Styles.baseSelector}
      >
        <option value="" hidden>
          {chord ? chord : t.SELECTED_CHORD}
        </option>
        {options.map((option) => (
          <option chord={option.value} value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ChordSelector
