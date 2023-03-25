import React, { useEffect, useState } from 'react'
import Styles from '../styles/displayScaleAndKey.module.css'
import { fetchKeyWithNote, fetchChordsWithNote } from '../api/index'
import { useLocale } from '../hooks/useLocale'
import Link from 'next/link'
import { useConvertScaleName } from '../hooks/useConvertScaleName'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IconContext } from 'react-icons'

const DisplayScaleAndKey = (props) => {
  const [displayResult, setDisplayResult] = useState([])
  const array = props.array
  const arrayChord = props.arrayChord
  const convertScale = useConvertScaleName()
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    if (array.length === 0) return
    //キーボードのデータを配列として受けとり、それを元にfetchKeyWithNoteを呼び出す
    const result = await fetchKeyWithNote(array)
    setIsLoading(false)
    if (!result || Object.values(result).length === 0) {
      setDisplayResult([])
    } else {
      for (let i = 0; i < result.length; i++) {
        if (i === 0) {
          setDisplayResult([])
        }
        setDisplayResult((prevState) => [
          ...prevState,
          { key: result[i].key, scale: result[i].scale },
        ])
      }
    }
  }

  const fetchDataChord = async () => {
    const rangeArr = Object.values(arrayChord).slice(2)
    if (rangeArr.every((element) => element === false)) return
    //キーボードのデータを配列として受けとり、それを元にfetchKeyWithNoteを呼び出す
    const result = await fetchChordsWithNote(arrayChord)
    setIsLoading(false)
    if (!result || Object.values(result).length === 0) {
      setDisplayResult([])
    } else {
      for (let i = 0; i < result.length; i++) {
        if (i === 0) {
          setDisplayResult([])
        }
        setDisplayResult((prevState) => [
          ...prevState,
          { root: result[i].root, type: result[i].type },
        ])
      }
    }
  }

  const { t } = useLocale()

  useEffect(() => {
    if (array) {
      fetchData()
    }
    if (arrayChord?.[Object.keys(arrayChord)[0]] ?? '') {
      fetchDataChord()
    }
  }, [array, arrayChord])

  useEffect(() => {
    if (props.urlArray) {
      if (props.urlArray.length === 0) return
      setIsLoading(true)
    }
  }, [props.urlArray])

  const list = displayResult.map((elm) => {
    if (array) {
      return (
        <Link
          href={`/scaleSearch/${encodeURIComponent(elm.key + '-' + elm.scale)}`}
          className={Styles.text}
          key={elm.key + elm.scale}
        >
          <p key={elm.key + elm.scale}>
            {elm.key}-{convertScale[elm.scale] + t.SELECTED_SCALE}
          </p>
        </Link>
      )
    } else if (arrayChord) {
      return (
        <Link
          href={`/chordSearch/${encodeURIComponent(elm.root + '-' + elm.type)}`}
          className={Styles.text}
          key={elm.root + elm.type}
        >
          <p key={elm.root + elm.type}>
            {elm.root}
            {elm.type === 'major' ? '' : elm.type}
          </p>
        </Link>
      )
    }
  })

  return (
    <div className={Styles.container}>
      <div className={Styles.subContainer}>
        {isLoading ? (
          <div className={Styles.loading}>
            <AiOutlineLoading3Quarters />
          </div>
        ) : (
          list
        )}
      </div>
    </div>
  )
}

export default DisplayScaleAndKey
