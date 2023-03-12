import React, { useEffect, useState } from 'react'
import Styles from '../styles/displayScaleAndKey.module.css'
import { fetchKeyWithNote } from '../api/index'
import { useLocale } from '../hooks/useLocale'
import Link from 'next/link'
import { useConvertScaleName } from '../hooks/useConvertScaleName'

const DisplayScaleAndKey = (props) => {
  const [displayResult, setDisplayResult] = useState([])
  const array = props.array

  const convertScale = useConvertScaleName()
  const fetchData = async () => {
    if (array.length === 0) return
    //キーボードのデータを配列として受けとり、それを元にfetchKeyWithNoteを呼び出す
    const result = await fetchKeyWithNote(array)
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
  const { t } = useLocale()

  useEffect(() => {
    fetchData()
  }, [array])

  const list = displayResult.map((elm) => (
    <Link
      href={`/scaleSearch/${encodeURIComponent(elm.key + '-' + elm.scale)}`}
      className={Styles.text}
      key={elm.key + elm.scale}
    >
      <p key={elm.key + elm.scale}>
        {elm.key}-{convertScale[elm.scale]}
      </p>
    </Link>
  ))

  return (
    <div className={Styles.container}>
      {/* <h1>{t.RESULT}</h1> */}

      <div className={Styles.subContainer}>{list}</div>
    </div>
  )
}

export default DisplayScaleAndKey
