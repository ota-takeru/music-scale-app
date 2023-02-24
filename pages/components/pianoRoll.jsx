import React, { useState, useEffect } from 'react'
import PianoAppearance from './pianoAppearance'
import styled from 'styled-components'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'
// import { useReseted } from "../hooks/useReseted";

const Button = styled.button`
  width: 80px;
  height: 60px;
  font-size: 20px;
  border-radius: 10px;
  background-color: #999;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.1s ease-in-out;
  &:hover {
    background-color: #aaa;
    border: 2px solid black;
  }
  &:active {
    background-color: #1b5e20;
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

  // const reseted = useReseted("false");
  const useReset = () => {
    if (reseted === 'false') {
      const { [Object.keys(finaldata)[2]]: firstItem, ...rest } = finaldata
      const newFinaldata = Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key, 'false'])
      )
      setFinaldata({ ...newFinaldata, [Object.keys(finaldata)[0]]: firstItem })
      // const [firstKey, ...otherKeys] = Object.keys(finaldata);
      // const newfinaldata = {
      //   [firstKey]: finaldata[firstKey], ...otherKeys.map(key => [key, false])
      // };
      // setFinaldata(newfinaldata);
      // console.log(reseted);
    }
    // useReseted("true");
  }

  return (
    <>
      <PianoAppearance
        primaryKey={primaryKey}
        setPrimaryKey={setPrimaryKey}
        finaldata={props.finaldata}
        setFinaldata={props.setFinaldata}
        // reseted = {reseted}
      />

      <Button onClick={useReset}>
        <IconContext.Provider value={{ size: '1.5em' }}>
          <HiOutlineRefresh />
        </IconContext.Provider>
      </Button>
    </>
  )
}

export default PianoRoll
