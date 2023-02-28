import React from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLocale } from '../hooks/useLocale'

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })

const SelectKey = (props) => {
  const [key, setKey] = useState('')
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
  const handleChange = (selectedOption) => {
    setKey(selectedOption.value)
    props.setSelectedKey(selectedOption.value)
  }
  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: '110px',
      height: '70px',
      fontSize: '25px',
      borderColor: state.isFocused ? '#007bff' : '#ddd',
      marginRight: '20px',
      boxShadow: '3px 3px 6px 1px #ddd',
      // textAlign: "center",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 3,
    }),
  }

  const { t } = useLocale()
  if (typeof document !== 'undefined') {
    return (
      <>
        <DynamicSelect
          options={options}
          onChange={handleChange}
          defaultValue={{ label: t.SELECTED_KEY, value: key }}
          styles={customStyles}
          menuPortalTarget={document.body}
        />
      </>
    )
  }
}

export default SelectKey
