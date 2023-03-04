import React from 'react'
import { useState } from 'react'
import Styles from '../styles/selectDiv.module.css'


const KeySelector = (props) => {
  const [key, setKey] = useState('Key')
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

  const handleChange = (e) => {
    setKey(e.target.value)
    props.setSelectedKey(e.target.value)
    console.log(e.target.value)
  }


  return (
    <div className={Styles.container}>
      <select
        onChange={handleChange}
        defaultValue={{ label: key, value: key }}
        className={Styles.baseSelector}
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

export default KeySelector
