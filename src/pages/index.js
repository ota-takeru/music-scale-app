import React, { useEffect } from 'react'
import SelectKey from '../components/selectKey'
import SelectScale from '../components/selectScale'
import PianoRoll from '../components/pianoRoll'
import SubContainer from '../components/subContainer'
import Container from '../components/container'
import { useState } from 'react'
import { fetchKey } from '../api/index'
import DisplayScaleAndKey from '../components/displayScaleAndKey'
import styled from 'styled-components'
import Header from '../components/header'
import { useLocale } from '../hooks/useLocale'
import { IoSearchOutline } from 'react-icons/io5'
import KeySelector from '../components/keySelector'
import ScaleSelector from '../components/scaleSelector'

const Button = styled.button`
  width: auto;
  height: 50px;
  padding: 0 20px;
  color: white;
  font-size: 25px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  background-color: dodgerblue;
  cursor: pointer;
  transition: 0.1s ease;
  box-shadow: 2px 2px 6px 2px #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  &:hover {
    background-color: deepskyblue;
  }

  @media (max-width: 850px) {
    &:hover {
    }
    &:active {
      background-color: dodgerblue;
    }
  }
`
const Text = styled.p`
  @media (max-width: 600px) {
    display: none;
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
    console.log(selectedKey)
    if (selectedKey && selectedScale) {
      const response = await fetchKey(selectedKey, selectedScale)
      setFinaldata(response[0])
    }
  }
  const { t } = useLocale()

  return (
    <>
      <Header />
      <Container>
        <SubContainer isresponsive="false">
          <KeySelector setSelectedKey={setSelectedKey} submit={submit} />
          <ScaleSelector setSelectedScale={setSelectedScale} submit={submit} />
          {/* <SelectKey setSelectedKey={setSelectedKey} submit={submit} /> */}
          {/* <SelectScale setSelectedScale={setSelectedScale} submit={submit} /> */}
          <Button type="submit" onClick={submit}>
            <IoSearchOutline size={30} />
            <Text>
               {t.SEARCH}
              </Text>           
          </Button>
        </SubContainer>
        <SubContainer isresponsive="false"></SubContainer>
        <SubContainer isresponsive="true">
          <DisplayScaleAndKey array={finaldata} finaldata={finaldata} />
          <PianoRoll finaldata={finaldata} setFinaldata={setFinaldata} />
        </SubContainer>
        <div>{/* <Guitar /> */}</div>
      </Container>
    </>
  )
}

export default App
