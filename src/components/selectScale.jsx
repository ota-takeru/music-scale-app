import React from 'react'
import { useState } from 'react'
import { useLocale } from '../hooks/useLocale'

import dynamic from 'next/dynamic'

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })

const SelectScale = (props) => {
  const [scale, setScale] = useState('')
  const { t } = useLocale()
  const options = [
    { value: 'major', label: t.MAJOR },
    { value: 'minor', label: t.MINOR },
    { value: 'harmonic-minor', label: t.HARMONIC_MINOR },
    { value: 'melodic-minor', label: t.MELODIC_MINOR },
    { value: 'major-pentatonic', label: t.MAJOR_PENTATONIC },
    { value: 'minor-pentatonic', label: t.MINOR_PENTATONIC },
    { value: 'blues', label: t.BLUES },
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
      fontSize: '25px',
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
        defaultValue={{ label: t.SELECTED_SCALE, value: scale }}
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    )
  }
}

export default SelectScale
