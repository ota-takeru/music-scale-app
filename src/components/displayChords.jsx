import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { fetchKey, fetchChords } from '../api'
import { useConvertKeyName } from '../hooks/useConvertKeyName'
import { useLocale } from '../hooks/useLocale'
import Link from 'next/link'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const DisplayChords = (props) => {
  const { BigToSmall, SmallToBig } = useConvertKeyName()
  const { array } = props
  const [displayThreeChords, setDisplayThreeChords] = useState([])
  const [displayFourChords, setDisplayFourChords] = useState([])
  const [displayOthers, setDisplayOthers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {}, [array])
  const FetchKey = async (key, scale) => {
    if (!key || !scale) return
    const response = await fetchKey(key, scale)
    const data = Object.keys(response[0]).filter((key) => response[0][key])
    data.splice(0, 2)
    return data
  }

  const FetchData = async (array) => {
    const response = await fetchChords(array)
    const filteredResponse = response
      .map((chord) => {
        const trueKeys = Object.keys(chord).filter(
          (key) => chord[key] && key !== 'root' && key !== 'type'
        )
        trueKeys.unshift(BigToSmall[chord.root], chord.type)
        const filtered = trueKeys.slice(2)
        if (filtered.every((item) => array.includes(item))) {
          return trueKeys
        }
        return null
      })
      .filter(Boolean)
    return filteredResponse
  }

  useEffect(() => {
    ;(async () => {
      const a = await FetchKey(array[0], array[1])
      const b = await FetchData(a)
      console.log(b)
      if (a && b) {
        const threeChords = {}
        const fourChords = {}
        const others = {}
        for (let i = 0; i < a.length; i++) {
          for (let j = 0; j < b.length; j++) {
            if (b[j][0] === a[i]) {
              if (b[j].length === 5) {
                threeChords[a[i]] = [
                  ...(threeChords[a[i]] || []),
                  [SmallToBig[b[j][0]], b[j][1] ? b[j][1] : ''],
                ]
              } else if (b[j].length === 6) {
                fourChords[a[i]] = [
                  ...(fourChords[a[i]] || []),
                  [SmallToBig[b[j][0]], b[j][1] ? b[j][1] : ''],
                ]
              } else {
                others[a[i]] = [
                  ...(others[a[i]] || []),
                  [SmallToBig[b[j][0]], b[j][1] ? b[j][1] : ''],
                ]
              }
            }
          }
          if (threeChords[a[i]] === undefined) {
            threeChords[a[i]] = []
          }
          if (fourChords[a[i]] === undefined) {
            fourChords[a[i]] = []
          }
          if (others[a[i]] === undefined) {
            others[a[i]] = []
          }
        }
        if (Object.keys(threeChords).length > 0) {
          setDisplayThreeChords(threeChords)
          setIsLoading(false)
        }
        if (Object.keys(fourChords).length > 0) {
          setDisplayFourChords(fourChords)
        }
        if (Object.keys(others).length > 0) {
          setDisplayOthers(others)
        }
      }
    })()
  }, [array[0], array[1]])

  const { t } = useLocale()

  return (
    <Table>
      <thead></thead>
      <tbody>
        <tr>
          <td key="threeChords">{t.THREE_CHORDS}</td>
          {isLoading ? (
            <td>
              <Spiner>
                <AiOutlineLoading3Quarters />
              </Spiner>
            </td>
          ) : (
            Object.keys(displayThreeChords).map((key) => (
              <td key={key}>
                {displayThreeChords[key].map((value) => (
                  <p key={'p' + value[0] + value[1]}>
                    <Link
                      key={value[0] + value[1]}
                      href={`/chordSearch/${encodeURIComponent(
                        value[0] + '-' + value[1]
                      )}`}
                    >
                      {value[0] + value[1]}
                    </Link>{' '}
                  </p>
                ))}
              </td>
            ))
          )}
        </tr>
        <tr>
          <td key="fourChords">{t.FOUR_CHORDS}</td>
          {isLoading ? (
            <td>
              <Spiner>
                <AiOutlineLoading3Quarters />
              </Spiner>
            </td>
          ) : (
            Object.keys(displayFourChords).map((key) => (
              <td key={key}>
                {displayFourChords[key].map((value) => (
                  <p key={'p' + value[0] + value[1]}>
                    <Link
                      key={value[0] + value[1]}
                      href={`/chordSearch/${encodeURIComponent(
                        value[0] + '-' + value[1]
                      )}`}
                    >
                      {value[0] + value[1]}
                    </Link>
                  </p>
                ))}
              </td>
            ))
          )}
        </tr>
        <tr>
          <td key="others">{t.OTHERS}</td>
          {isLoading ? (
            <td>
              <Spiner>
                <AiOutlineLoading3Quarters />
              </Spiner>
            </td>
          ) : (
            Object.keys(displayOthers).map((key) => (
              <td key={key}>
                {displayOthers[key].map((value) => (
                  <p key={'p' + value[0] + value[1]}>
                    <Link
                      key={value[0] + value[1]}
                      href={`/chordSearch/${encodeURIComponent(
                        value[0] + '-' + value[1]
                      )}`}
                    >
                      {value[0] + value[1]}
                    </Link>
                  </p>
                ))}
              </td>
            ))
          )}
        </tr>
      </tbody>
    </Table>
  )
}

export default DisplayChords

const Table = styled.table`
  border-collapse: collapse; /* テーブルの境界線を非表示にする */
  width: 90%;
  margin: 0 auto;
  text-align: center;
  th,
  td {
    text-align: center;
    padding: 8px;
    border-bottom: 1px solid #ddd; /* セルの下線を表示する */
    word-break: normal;
    white-space: wrap;
    p {
      display: inline;
      margin: 0;
      font-size: 1.1em;
      &:hover {
        text-decoration: underline;
      }
    }
    a {
      text-decoration: none;
      color: #333;
    }
  }
  th {
    background-color: #f2f2f2; /* ヘッダーの背景色を設定する */
    color: #555;
  }
  td:first-child {
    width: 4em;
    padding: 16px 16px;
    background-color: #f2f2f2; /* ヘッダーの背景色を設定する */
  }

  @media screen and (max-width: 850px) {
    writing-mode: vertical-lr;
    width: 80%;
    padding: 10px;
    th,
    td {
      width: 5em;
      writing-mode: horizontal-tb;
    }
  }
`
const Spiner = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spin 1s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`
