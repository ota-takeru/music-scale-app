import styled from 'styled-components'
import Fret from './fret'
import React, { useEffect, useState } from 'react'

const String = ({ finaldata, setFinaldata, n }) => {
  const [values, setValues] = useState([])
  const setValuesToArray = () => {
    const newArray = Object.values(finaldata).slice(2)
    const frontArray = newArray.slice(0, n)
    const backArray = newArray.slice(n)
    const finalArray = backArray.concat(frontArray)
    setValues(finalArray)
  }
  const [keys, setKeys] = useState([])
  const setKeysToArray = () => {
    const newArray = Object.keys(finaldata).slice(2)
    const frontArray = newArray.slice(0, n)
    const backArray = newArray.slice(n)
    const finalArray = backArray.concat(frontArray)
    setKeys(finalArray)
  }
  useEffect(() => {
    setValuesToArray()
    setKeysToArray()
  }, [finaldata])
  
  return (
    <Container>
      {values.map((value, index) => (
        <Fret
          isdown={value}
          setFinaldata={setFinaldata}
          key={keys[index]}
          label={keys[index]}
        />
      ))}
      <Fret isdown={values[0]} setFinaldata={setFinaldata} label={keys[0]} />
    </Container>
  )
}

export default String

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  &:before {
    content: '';
    width: 100%;
    height: 7px;
    background-color: #f0f8ff;
    box-shadow: 0 2px 2px 0 #ccc;
    z-index: 1;
    top: 15px;
    position: absolute;
  }
  @media (max-width: 600px) {
    // writing-mode: horizontal-tb;
  }
`
