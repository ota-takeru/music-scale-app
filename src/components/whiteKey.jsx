import Styles from '../styles/whiteKey.module.css'
import { useEffect, useState } from 'react'
import React from 'react'

const WhiteKey = (props) => {
  const [down, setDown] = useState('false')
  const finaldata = props.finaldata ? props.finaldata : props.finalchord
  const setFinaldata =  props.setFinaldata ? props.setFinaldata : props.setFinalchord
  const n = props.n
  const setPrimaryKey = props.setPrimaryKey
  const primaryKey = props.primaryKey
  const pressed = () => {
    if (down === 'false') {
      setDown('true')
      setFinaldata((prev) => ({
        ...prev,
        [Object.keys(finaldata)[n + 2]]: true,
      }))
    } else {
      setDown('false')
      setFinaldata((prev) => ({
        ...prev,
        [Object.keys(finaldata)[n + 2]]: false,
      }))
    }
    if (props.isPrimaryKey === 'true') {
      setPrimaryKey(primaryKey.map((item) => (item = 'false')))
    }
  }
  useEffect(() => {
    setDown(props.isdown)
  }, [props.isdown])

  return (
    <div
      className={Styles.whiteKey}
      onClick={pressed}
      isdown={down}
      isprimarykey={props.isPrimaryKey}
    >
      <span className={Styles.keyLabel}>{props.label}</span>
    </div>
  )
}
export default WhiteKey
