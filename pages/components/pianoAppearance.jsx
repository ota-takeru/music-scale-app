import Styles from '../styles/pianoAppearance.module.css'
import { useEffect, useState } from 'react'
import WhiteKey from './whiteKey'
import BlackKey from './blackKey'
import React from 'react'

const PianoAppearance = (props) => {
  const finaldata = props.finaldata
  const setFinaldata = props.setFinaldata
  const primaryKey = props.primaryKey
  const setPrimaryKey = props.setPrimaryKey

  const keyList = [
    'A',
    'A#',
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
  ]
  const setReseted = props.setReseted
  const updatePrimaryKey = () => {
    setPrimaryKey(
      primaryKey.map((item, index) =>
        index === keyList.findIndex((item) => item === finaldata.key)
          ? (item = "true")
          : (item = "false")
      ) 
    )
  }
  useEffect(() => {
    if (finaldata.key) {
      updatePrimaryKey()
    }
  }, [finaldata.key])

  return (
    <div id={Styles.pianoContainer}>
      <div id={Styles.pianoWrap}>
        <WhiteKey
          isdown={finaldata.c.toString()}
          isPrimaryKey={Object.values(primaryKey)[3]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="C"
          n={3}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
        <BlackKey
          isdown={finaldata.c_sharp.toString()}
          isPrimaryKey={Object.values(primaryKey)[4]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="C#/Db"
          n={4}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
        <WhiteKey
          isdown={finaldata.d.toString()}
          isPrimaryKey={Object.values(primaryKey)[5]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="D"
          n={5}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
        <BlackKey
          isdown={finaldata.d_sharp.toString()}
          isPrimaryKey={Object.values(primaryKey)[6]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="D#/Eb"
          n={6}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <WhiteKey
          isdown={finaldata.e.toString()}
          isPrimaryKey={Object.values(primaryKey)[7]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="E"
          n={7}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <WhiteKey 
          isdown={finaldata.f.toString()}
          isPrimaryKey={Object.values(primaryKey)[8]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="F"
          n={8}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <BlackKey
          isdown={finaldata.f_sharp.toString()}
          isPrimaryKey={Object.values(primaryKey)[9]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="F#/Gb"
          n={9}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <WhiteKey
          isdown={finaldata.g.toString()}
          isPrimaryKey={Object.values(primaryKey)[10]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="G"
          n={10}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
        <BlackKey
          isdown={finaldata.g_sharp.toString()}
          isPrimaryKey={Object.values(primaryKey)[11]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="G#/Ab"
          n={11}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
        <WhiteKey
          isdown={finaldata.a.toString()}
          isPrimaryKey={Object.values(primaryKey)[0]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="A"
          n={0}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <BlackKey
          isdown={finaldata.a_sharp.toString()}
          isPrimaryKey={Object.values(primaryKey)[1]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="A#/Bb"
          n={1}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />  
        <WhiteKey
          isdown={finaldata.b.toString()}
          isPrimaryKey={Object.values(primaryKey)[2]}
          setPrimaryKey={setPrimaryKey}
          primaryKey={primaryKey}
          label="B"
          n={2}
          finaldata={finaldata}
          setFinaldata={setFinaldata}
        />
       
      
      </div>
    </div>
  )
}

export default PianoAppearance
