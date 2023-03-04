import React, { useState, useEffect } from 'react'
import PianoAppearance from './pianoAppearance'
import styled from 'styled-components'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'

const Button = styled.button`
  width: 80px;
  height: 60px;
  font-size: 20px;
  border-radius: 10px;
  background-color: #999;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.1s ease;
  box-shadow: 2px 2px 6px 1px #ddd;
  &:hover {
    background-color: #aaa;
    border: 2px solid #999;
  }

  @media (max-width: 600px) {
    width: 60%;
    margin: 20px 0 20px 0;
  }
`
const Div = styled.div`
  display: flex;
  margin: 0 0 20px 0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`

const PianoRoll = (props) => {
  const finaldata = props.finaldata
  const setFinaldata = props.setFinaldata
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
    const { key: key, scale: scale, ...rest } = finaldata
    const newFinaldata = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [key, false])
    )
    setFinaldata({ key: key, scale: scale, ...newFinaldata })
    setPrimaryKey(primaryKey.fill('false'))
  }

  return (
    <Div>
      <PianoAppearance
        primaryKey={primaryKey}
        setPrimaryKey={setPrimaryKey}
        finaldata={props.finaldata}
        setFinaldata={props.setFinaldata}
      />

      <Button onClick={Reset}>
        <IconContext.Provider value={{ size: '1.5em' }}>
          <HiOutlineRefresh />
        </IconContext.Provider>
      </Button>
    </Div>
  )
}

export default PianoRoll
