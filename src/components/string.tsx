import Fret from './fret'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { ScaleData, ChordData } from '../types'

interface StringProps {
  finaldata?: ScaleData | ChordData
  setFinaldata?: (
    data:
      | ScaleData
      | ChordData
      | ((prev: ScaleData | ChordData) => ScaleData | ChordData)
  ) => void
  n: number
}

const String: React.FC<StringProps> = React.memo(
  ({ finaldata, setFinaldata, n }) => {
    const [values, setValues] = useState<boolean[]>([])
    const [keys, setKeys] = useState<string[]>([])

    const setValuesToArray = useCallback(() => {
      if (!finaldata) {
        setValues([])
        return
      }
      const newArray = Object.values(finaldata).slice(2) as boolean[]
      const frontArray = newArray.slice(0, n)
      const backArray = newArray.slice(n)
      const finalArray = backArray.concat(frontArray)
      setValues(finalArray)
    }, [finaldata, n])

    const setKeysToArray = useCallback(() => {
      if (!finaldata) {
        setKeys([])
        return
      }
      const newArray = Object.keys(finaldata).slice(2)
      const frontArray = newArray.slice(0, n)
      const backArray = newArray.slice(n)
      const finalArray = backArray.concat(frontArray)
      setKeys(finalArray)
    }, [finaldata, n])

    useEffect(() => {
      setValuesToArray()
      setKeysToArray()
    }, [finaldata, setValuesToArray, setKeysToArray])

    // フレットのリストをメモ化（データがある場合のみ）
    const frets = useMemo(() => {
      if (!finaldata || !setFinaldata) return []
      return values.map((value, index) => (
        <Fret
          key={keys[index]}
          isdown={value}
          setFinaldata={setFinaldata}
          label={keys[index]}
        />
      ))
    }, [values, keys, setFinaldata, finaldata])

    // 追加のフレット（最後のフレット）もメモ化
    const lastFret = useMemo(() => {
      if (!finaldata || !setFinaldata || keys.length === 0) return null
      return (
        <Fret
          key={`${keys[0]}-duplicate`}
          isdown={values[0]}
          setFinaldata={setFinaldata}
          label={keys[0]}
        />
      )
    }, [values, keys, setFinaldata, finaldata])

    // データがない場合は早期リターン
    if (!finaldata || !setFinaldata) {
      return <div className="string">データがありません</div>
    }

    return (
      <div className="string">
        {frets}
        {lastFret}
      </div>
    )
  }
)

String.displayName = 'String'

export default String
