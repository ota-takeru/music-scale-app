import React, { useState, useEffect } from 'react'
import PianoAppearance from './pianoAppearance'
import styled from 'styled-components'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'

const PianoRoll = (props) => {
  const finaldata = props.finaldata
  const setFinaldata = props.setFinaldata
  const setFinalchord = props.setFinalchord
  const finalchord = props.finalchord
  const [primaryKey, setPrimaryKey] = useState([
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
  ])

  const Reset = () => {
    useReset(
      finaldata,
      setFinaldata,
      finalchord,
      setFinalchord,
      primaryKey,
      setPrimaryKey
    )
  }

  return (
    <Div>
      <PianoAppearance
        primaryKey={primaryKey}
        setPrimaryKey={setPrimaryKey}
        finaldata={props.finaldata}
        setFinaldata={props.setFinaldata}
        finalchord={props.finalchord}
        setFinalchord={props.setFinalchord}
      />
      <ResetButton reset={Reset} />
    </Div>
  )
}

export default PianoRoll

const Div = styled.div`
  display: flex;
  margin: 0 0 20px 0;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    margin: 0;
  }
`
