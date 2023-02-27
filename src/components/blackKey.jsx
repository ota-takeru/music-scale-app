import Styles from '../styles/blackKey.module.css'
import { useEffect, useState } from 'react'
import React from 'react'

const BlackKey = (props) => {
  const [down, setDown] = useState('false')
  const setFinaldata = props.setFinaldata
  const finaldata = props.finaldata
  const n = props.n
  const pressed = (e) => {
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
    if (props.isPrimaryKey === true) {
      setPrimaryKey(primaryKey.map((item) => (item = false)))
    }
  }
  useEffect(() => {
    setDown(props.isdown)
  }, [props.isdown])

  return (
    <div
      className={Styles.blackKey}
      onClick={pressed}
      isdown={down}
      isprimarykey={props.isPrimaryKey}
    >
      <span className={Styles.keyLabel}>{props.label}</span>
    </div>
  )
}
export default BlackKey
