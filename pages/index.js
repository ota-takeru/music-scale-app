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
import supabase from '@/utils/supabase'

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
  transition: 0.1s ease-in-out;
  boxshadow: 3px 3px 6px 1px #ddd;
  &:hover {
    background-color: deepskyblue;
  }
`

const App = () => {
  const [selectedKey, setSelectedKey] = useState('')
  const [selectedScale, setSelectedScale] = useState('')
  const [displayArray, setDisplayArray] = useState([])
  const [finaldata, setFinaldata] = useState({
    a: 'false',
    a_sharp: 'false',
    b: 'false',
    c: 'false',
    c_sharp: 'false',
    d: 'false',
    d_sharp: 'false',
    e: 'false',
    f: 'false',
    f_sharp: 'false',
    g: 'false',
    g_sharp: 'false',
    key: '',
    scale: '',
  })

  useEffect(() => {
    // for (let i = 0; i < Object.values(finaldata).length; i++) {
    //   setDisplayArray((prevdata) => ({
    //     ...prevdata,
    //     [Object.keys(finaldata)[i].toString()]:
    //       Object.values(finaldata)[i].toString().charAt(0).toUpperCase() +
    //       Object.values(finaldata)[i].toString().slice(1),
    //   }));
    // }
    // console.log(displayArray);
  }, [finaldata])

  const submit = async () => {
    if (selectedKey && selectedScale) {
      // const response = await fetchKey(selectedKey, selectedScale)
      try {
        const { response, error } = await supabase.from('key').select('*')
        if (error) throw error
        console.log(response)
      } catch (error) {
        console.error(error)
      }
      // for (let i = 0; i < Object.values(response.data[0]).length; i++) { //数字で調べる
      //   setFinaldata((prevdata) => ({
      //     ...prevdata,
      //     [Object.keys(response.data[0])[i].toString()]: Object.values(
      //       response.data[0]
      //       )[i].toString(),
      //     }));
      //   }
      // if (response.data[0]) {
      //   setFinaldata(response.data[0]);
      // }
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
