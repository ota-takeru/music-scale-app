import React, { useEffect } from 'react'
import PianoRoll from './pianoRoll.jsx'
import SubContainer from './subContainer'
import Container from './container'
import { useState } from 'react'
import styled from 'styled-components'
import Header from './header'
import { useLocale } from '../hooks/useLocale'
import Head from './head'
import { useRouter } from 'next/router'
import Footer from './footer'
import KeySelector from './keySelector'
import ChordSelector from './chordSelector'
import { fetchChordsWithName } from '@/src/api/index.js'
import DisplayScaleAndKey from './displayScaleAndKey'
import Fingerboard from './fingerBoard'
import { IconContext } from 'react-icons'
import { RxDoubleArrowUp } from 'react-icons/rx'


const ChordSearch = (props) => {
  const { urlArray } = props
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState('')
  const [selectedChord, setSelectedChord] = useState('')
  const [finalchord, setFinalchord] = useState({
    root: '',
    type: '',
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

  // const submit = (event) => {
  //   event.preventDefault()
  //   if (!selectedKey || !selectedScale) {
  //     return
  //   }
  //   router.push(
  //     `/scaleSearch/${encodeURIComponent(selectedKey)}-${selectedScale}`
  //   )
  // }
  const [displayPiano, setDisplayPiano] = useState(true)
  const [displayFingerBoard, setDisplayFingerBoard] = useState(false)
  const handlePiano = () => {
    setDisplayPiano(!displayPiano)
  }
  const handleFingerBoard = () => {
    setDisplayFingerBoard(!displayFingerBoard)
  }

  const getKey = async (key, type) => {
    if (!key || !type) {
      return
    }
    await router.push(`/chordSearch/${encodeURIComponent(key)}-${type}`)
    const response = await fetchChordsWithName(key, type)
    setFinalchord(response[0])
  }
  useEffect(() => {
    setSelectedKey(urlArray[0])
    setSelectedChord(urlArray[1])
  }, [urlArray])

  useEffect(() => {
    if (selectedKey && selectedChord) {
      getKey(selectedKey, selectedChord)
    }
  }, [selectedKey, selectedChord])

  const { t } = useLocale()

  return (
    <>
      <Head 
        title={t.CHORD_TITLE}
        descriptions={t.DESCRIPTION_CHORD}
        keywords={t.KEYWORDS}
        />
      <Header href="/chordSearch" title={t.CHORD_TITLE} />
      <Container>
        <SubContainer isresponsive="false">
          <KeySelector
            label={t.SELECTED_ROOT}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
          <ChordSelector
            selectedChord={selectedChord}
            setSelectedChord={setSelectedChord}
          />
        </SubContainer>
        <SubContainer isresponsive="true">
          <DisplayScaleAndKey arrayChord={finalchord} urlArray={urlArray} />
          <Div>
            <SubHead onClick={handlePiano} displayPiano={displayPiano}>
              <IconContext.Provider value={{ size: '2em' }}>
                <RxDoubleArrowUp />
              </IconContext.Provider>
              <h1>piano</h1>
            </SubHead>
            {displayPiano && (
              <PianoRoll finaldata={finalchord} setFinaldata={setFinalchord} />
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
              <Fingerboard finaldata={finalchord} setFinaldata={setFinalchord} />
            )}
          </Div>
        </SubContainer>
      </Container>
    </>
  )
}

export default ChordSearch

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
