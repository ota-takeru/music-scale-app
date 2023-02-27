import React, { useEffect } from 'react'
import SelectKey from './components/selectKey'
import SelectScale from './components/selectScale'
import PianoRoll from './components/pianoRoll'
import SubContainer from './components/subContainer'
import Container from './components/container'
import { useState } from 'react'
import { fetchKey } from './api/index'
// import Guitar from "./components/guitar";
import DisplayScaleAndKey from './components/displayScaleAndKey'
import styled from 'styled-components'

const Button = styled.input`
  width: 140px;
  height: 70px;
  color: white;
  font-size: 30px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background-color: dodgerblue;
  cursor: pointer;
  transition: 0.1s ease;
  box-shadow: 2px 2px 6px 2px #ccc;
  &:hover {
    background-color: deepskyblue;
    border: 2px solid dodgerblue;
  }
`

const App = () => {
  const [selectedKey, setSelectedKey] = useState('')
  const [selectedScale, setSelectedScale] = useState('')
  const [displayArray, setDisplayArray] = useState([])
  const [finaldata, setFinaldata] = useState({
    key: '',
    scale: '',
    a: false,
    a_sharp: false,
    b: false,
    c: false,
    c_sharp: false,
    d: false,
    d_sharp: false,
    e: false,
    f: false,
    f_sharp: false,
    g: false,
    g_sharp: false,
  })

  const submit = async () => {
    if (selectedKey && selectedScale) {
      const response = await fetchKey(selectedKey, selectedScale)
      setFinaldata(response[0])
    }
  }

  return (
    <Container>
      <h1>Music Scale</h1>
      <SubContainer form={true}>
        <SelectKey setSelectedKey={setSelectedKey} submit={submit} />
        <SelectScale setSelectedScale={setSelectedScale} submit={submit} />
        <Button type="submit" value="Search" onClick={submit} />
      </SubContainer>
      <SubContainer form={false}>
        <DisplayScaleAndKey array={finaldata} finaldata={finaldata} />
        <PianoRoll finaldata={finaldata} setFinaldata={setFinaldata} />
      </SubContainer>
      <div>{/* <Guitar /> */}</div>
    </Container>
  )
}

export default App
