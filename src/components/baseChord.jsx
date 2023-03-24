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
import KeySelector from '@/src/components/keySelector.jsx'
import ChordSelector from '@/src/components/chordSelector.jsx'
import {fetchChordsWithName} from '@/src/api/index.js'
import DisplayScaleAndKey from '@/src/components/displayScaleAndKey.jsx'

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

  const getKey = async (key, chord) => {
    if (!key || !chord) {
      return
    }
    await router.push(
      `/chordSearch/${encodeURIComponent(selectedKey)}-${selectedChord}`
    )
    const response = await fetchChordsWithName(key, chord)
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
      <Head />
      <Header href="/chordSearch" title={t.CHORD_TITLE} />
      <Container>
        <SubContainer isresponsive="false" >
          <KeySelector
          label={t.SELECTED_ROOT    }
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
          <ChordSelector
            selectedChord={selectedChord}
            setSelectedChord={setSelectedChord}
          />
        </SubContainer>
        <SubContainer isresponsive="true">
          <DisplayScaleAndKey
            arrayChord={finalchord}
          />
          <PianoRoll
            finalchord={finalchord}
            setFinalchord={setFinalchord}
          />
        </SubContainer>
      </Container>
    </>
  )
}

export default ChordSearch
