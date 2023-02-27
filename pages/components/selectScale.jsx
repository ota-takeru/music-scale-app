import React from 'react'
import { useState } from 'react'

import dynamic from 'next/dynamic'

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })

const SelectScale = (props) => {
  const [scale, setScale] = useState('')
  const options = [
    { value: 'major', label: 'major' },
    { value: 'minor', label: 'minor' },
    { value: 'harmonic-minor', label: 'harmonic-minor' },
    { value: 'melodic-minor', label: 'melodic-minor' },
    { value: 'major-pentatonic', label: 'major-pentatonic' },
    { value: 'minor-pentatonic', label: 'minor-pentatonic' },
    { value: 'blues', label: 'blues' },
  ]
  const handleChange = (selectedOption) => {
    setScale(selectedOption.value)
    props.setSelectedScale(selectedOption.value)
  }
  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: '300px',
      height: '70px',
      fontSize: '30px',
      borderColor: state.isFocused ? '#007bff' : '#ddd',
      marginRight: '20px',
      boxShadow: '3px 3px 6px 1px #ddd',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 3,
    }),
  }

  if (typeof document !== 'undefined') {
    return (
      <DynamicSelect
        options={options}
        onChange={handleChange}
        defaultValue={{ label: 'scale', value: scale }}
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    )
  }
}

export default SelectScale
