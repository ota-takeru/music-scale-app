import React, { useEffect, useState } from 'react'
import Styles from '../styles/displayScaleAndKey.module.css'
import { fetchKeyWithNote } from '../api/index'
import { useLocale } from '../hooks/useLocale'

const DisplayScaleAndKey = (props) => {
  const [displayResult, setDisplayResult] = useState([])
  const array = props.array

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
          result[i].key + '-' + result[i].scale,
        ])
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [array])

  const list = displayResult.map((elm) => <p key={elm}>{elm}</p>)
  const { t } = useLocale()

  return (
    <div className={Styles.container}>
      {/* <h1>{t.RESULT}</h1> */}

      <div className={Styles.subContainer}>{list}</div>
    </div>
  )
}

export default DisplayScaleAndKey
