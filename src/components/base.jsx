import React, { useEffect } from 'react'
// import SelectKey from '../components/selectKey'
// import SelectScale from '../components/selectScale'
import PianoRoll from './pianoRoll'
import SubContainer from './subContainer'
import Container from './container'
import { useState } from 'react'
import { fetchKey } from '../api/index'
import DisplayScaleAndKey from './displayScaleAndKey'
import styled from 'styled-components'
import Header from './header'
import { useLocale } from '../hooks/useLocale'
import { IoSearchOutline } from 'react-icons/io5'
import KeySelector from './keySelector'
import ScaleSelector from './scaleSelector'
import Head from './head'
import { useRouter } from 'next/router'
import Footer from './footer'

const ScaleSearch = (props) => {
  const { queryKey, queryScale, urlArray } = props
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState('')
  const [selectedScale, setSelectedScale] = useState('')
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

  const submit = (event) => {
    event.preventDefault()
    if (!selectedKey || !selectedScale) {
      return
    }
    router.push(
      `/scaleSearch/${encodeURIComponent(selectedKey)}-${selectedScale}`
    )
  }

  const getKey = async (key, scale) => {
    if (!key || !scale) {
      return
    }

    await router.push(
      `/scaleSearch/${encodeURIComponent(selectedKey)}-${selectedScale}`
    )
    const response = await fetchKey(key, scale)
    setFinaldata(response[0])
  }

  const { t } = useLocale()

  useEffect(() => {
    setSelectedKey(urlArray[0])
    setSelectedScale(urlArray[1])
  }, [urlArray])

  useEffect(() => {
    getKey(selectedKey, selectedScale)
  }, [selectedKey, selectedScale])

  const [array, setArray] = useState([urlArray])

  return (
    <>
      <Head
        title={t.TITLE}
        descriptions={t.DESCRIPTIONS}
        keywords={t.KEYWORDS}
      />
      <Header />
      <Container>
        <SubContainer isresponsive="false">
          <KeySelector
            setSelectedKey={setSelectedKey}
            selectedKey={selectedKey}
          />
          <ScaleSelector
            setSelectedScale={setSelectedScale}
            selectedScale={selectedScale}
          />
          {/* <Button type="submit" onClick={submit}>
            <IoSearchOutline size={30} />
            <Text>{t.SEARCH}</Text>
          </Button> */}
        </SubContainer>
        <SubContainer isresponsive="false"></SubContainer>
        <SubContainer isresponsive="true">
          <DisplayScaleAndKey array={finaldata} finaldata={finaldata} />
          <PianoRoll finaldata={finaldata} setFinaldata={setFinaldata} />
        </SubContainer>
        <div>{/* <Guitar /> */}</div>
        <SubContainer isresponsive="false">{props.children}</SubContainer>
      </Container>
      <Footer />
    </>
  )
}

export default ScaleSearch

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
