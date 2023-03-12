import React from 'react'
import { useState, useEffect } from 'react'
import Styles from '../styles/selectDiv.module.css'
import { useLocale } from '../hooks/useLocale'

const KeySelector = (props) => {
  const options = [
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
  ]
  const [key, setKey] = useState(props.selectedKey)

  const handleChange = (e) => {
    setKey(e.target.value)
    props.setSelectedKey(e.target.value)
  }

  useEffect(() => {
    setKey(props.selectedKey)
  }, [props.selectedKey])

  const { t } = useLocale()
  return (
    <div className={Styles.container}>
      <select
        onChange={handleChange}
        className={Styles.baseSelector}
        defaultValue={key}
        label={key}
      >
        <option value="" hidden>
          {key ? key : t.SELECTED_KEY}
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

export default KeySelector
