import React, { useEffect } from 'react'
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
import Fingerboard from './fingerBoard'
import { RxDoubleArrowUp } from 'react-icons/rx'
import { IconContext } from 'react-icons'

const ScaleSearch = (props) => {
  const { urlArray } = props
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
  const [displayPiano, setDisplayPiano] = useState(true)
  const [displayFingerBoard, setDisplayFingerBoard] = useState(false)
  const handlePiano = () => {
    setDisplayPiano(!displayPiano)
  }
  const handleFingerBoard = () => {
    setDisplayFingerBoard(!displayFingerBoard)
  }
  const getKey = async (key, scale) => {
    if (!key || !scale) return
    await router.push(
      `/scaleSearch/${encodeURIComponent(selectedKey)}-${selectedScale}`
    )
    const response = await fetchKey(key, scale)
    setFinaldata(response[0])
  }
  useEffect(() => {
    setSelectedKey(urlArray[0])
    setSelectedScale(urlArray[1])
  }, [urlArray])

  useEffect(() => {
    getKey(selectedKey, selectedScale)
  }, [selectedKey, selectedScale])

  const { t } = useLocale()
  return (
    <>
      <Head
        title={t.TITLE}
        descriptions={t.DESCRIPTIONS}
        keywords={t.KEYWORDS}
      />
      <Header href="/scaleSearch" title={t.SCALE_TITLE} />
      <Container>
        <SubContainer isresponsive="false">
          <KeySelector
            label={t.SELECTED_KEY}
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
        <SubContainer isresponsive="true">
          
          <DisplayScaleAndKey array={finaldata} urlArray={urlArray} />
          <Div>
            <SubHead onClick={handlePiano} displayPiano={displayPiano}>
              <IconContext.Provider value={{ size: '2em' }}>
                <RxDoubleArrowUp />
              </IconContext.Provider>
              <h1>piano</h1>
            </SubHead>
            {displayPiano && (
              <PianoRoll finaldata={finaldata} setFinaldata={setFinaldata} />
            )}
            <SubHead
              onClick={handleFingerBoard}
              displayFingerBoard={displayFingerBoard}
            >
              <IconContext.Provider value={{ size: '2em' }}>
                <RxDoubleArrowUp />
              </IconContext.Provider>
              <h1>guitar</h1>
            </SubHead>
            {displayFingerBoard && (
              <Fingerboard finaldata={finaldata} setFinaldata={setFinaldata} />
            )}
          </Div>
        </SubContainer>
        <SubContainer isresponsive="false">{props.children}</SubContainer>
      </Container>
      {/* <Footer /> */}
    </>
  )
}

export default ScaleSearch

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 34em;
  height: 100%;
  padding: 0 10px 0 10px;
  background-color: #f5f5f5;
  margin: 0 0 20px 0;
  transform-origin: top left;
  @media (max-width: 600px) {
    width: 23em;
  }
  @media (max-width: 400px) {
    width: 19em;
  }
`
const SubHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
  cursor: pointer;
  @media (max-width: 600px) {
    height: 40px;
    margin-bottom: 10px;
  }
  &:hover {
    background-color: #eee;
  }

  svg {
    transition: 0.1s ease;
    ${({ displayPiano }) =>
      displayPiano &&
      `
    transform: rotate(180deg);
    `}
    ${({ displayFingerBoard }) =>
      displayFingerBoard && `transform: rotate(180deg);`}
  }
  h1 {
    margin-left: 30px;
    user-select: none;
    font-size: 1.3em;
  }
`
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
// const submit = (event) => {
//   event.preventDefault()
//   if (!selectedKey || !selectedScale) {
//     return
//   }
//   router.push(
//     `/scaleSearch/${encodeURIComponent(selectedKey)}-${selectedScale}`
//   )
// }
