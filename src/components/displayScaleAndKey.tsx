import React, { useEffect, useState, useCallback, useMemo } from 'react'
// CSS modules removed - using unified Tailwind design system
import { fetchKeyWithNote, fetchChordsWithNote } from '../api/index'

import ApiErrorDisplay from './common/ApiErrorDisplay'
import LoadingSpinner from './common/LoadingSpinner'
import { useLoading } from '../hooks/useLoading'
import { useLocale } from '../hooks/useLocale'
import Link from 'next/link'
import { useConvertScaleName } from '../hooks/useConvertScaleName'
import type { ScaleData, ChordData, ApiError, ScaleType } from '../types'

interface DisplayScaleAndKeyProps {
  array?: ScaleData
  arrayChord?: ChordData
  urlArray: string[]
}

interface SearchResult {
  key?: string
  scale?: string
  root?: string
  type?: string
}

// 検索設定を定義
type SearchMode = 'scale' | 'chord'

interface SearchConfig {
  mode: SearchMode
  data: ScaleData | ChordData | undefined
  apiFunction: (data: any) => Promise<any>
  hasDirectData: () => boolean
  getDirectResult: () => SearchResult
  mapResult: (item: any) => SearchResult
}

const DisplayScaleAndKey: React.FC<DisplayScaleAndKeyProps> = React.memo(
  ({ array, arrayChord, urlArray }) => {
    const [displayResult, setDisplayResult] = useState<SearchResult[]>([])
    const [error, setError] = useState<ApiError | null>(null)
    const { isLoading, setIsLoading } = useLoading(false)

    const convertScale = useConvertScaleName()
    const { t } = useLocale()

    // 統一的な検索関数
    const fetchSearchData = useCallback(
      async (config: SearchConfig) => {
        // URLArrayから直接表示する場合の処理
        if (urlArray && urlArray.length >= 2 && urlArray[0] && urlArray[1]) {
          const [first, second] = urlArray
          const directResult =
            config.mode === 'scale'
              ? { key: first, scale: second }
              : { root: first, type: second }
          console.log(
            `Direct ${config.mode} display from urlArray:`,
            directResult
          )
          setDisplayResult([directResult])
          setIsLoading(false)
          return
        }

        if (
          !config.data ||
          (Array.isArray(config.data) && config.data.length === 0)
        ) {
          setIsLoading(false)
          setDisplayResult([])
          return
        }

        // URLから直接アクセスされた場合は直接表示
        if (config.hasDirectData()) {
          setDisplayResult([config.getDirectResult()])
          setIsLoading(false)
          return
        }

        // 音符データがない場合（全てfalse）は結果をクリア
        const rangeArr = Object.values(config.data).slice(2)
        if (rangeArr.every((element) => element === false)) {
          setIsLoading(false)
          setDisplayResult([])
          return
        }

        // 音符データがある場合は検索を実行
        setIsLoading(true)
        setError(null)

        const result = await config.apiFunction(config.data)
        setIsLoading(false)

        if (!result.success) {
          setError(result.error!)
          return
        }

        if (!result.data || result.data.length === 0) {
          setDisplayResult([])
        } else {
          // 結果を適切にマッピング
          const newResults = result.data.map(config.mapResult)
          setDisplayResult(newResults)
        }
      },
      [urlArray, setIsLoading]
    )

    // スケール検索の設定
    const scaleConfig: SearchConfig = useMemo(
      () => ({
        mode: 'scale' as const,
        data: array,
        apiFunction: fetchKeyWithNote,
        hasDirectData: () => !!(array?.key && array?.scale),
        getDirectResult: () => ({ key: array!.key, scale: array!.scale }),
        mapResult: (item: any) => ({ key: item.key, scale: item.scale }),
      }),
      [array]
    )

    // コード検索の設定
    const chordConfig: SearchConfig = useMemo(
      () => ({
        mode: 'chord' as const,
        data: arrayChord,
        apiFunction: fetchChordsWithNote,
        hasDirectData: () => !!(arrayChord?.root && arrayChord?.type),
        getDirectResult: () => ({
          root: arrayChord!.root,
          type: arrayChord!.type,
        }),
        mapResult: (item: any) => ({ root: item.root, type: item.type }),
      }),
      [arrayChord]
    )

    useEffect(() => {
      if (array) {
        fetchSearchData(scaleConfig)
      } else if (arrayChord) {
        fetchSearchData(chordConfig)
      } else {
        // arrayもarrayChordもない場合は結果をクリア
        setDisplayResult([])
        setIsLoading(false)
      }
    }, [
      array,
      arrayChord,
      fetchSearchData,
      scaleConfig,
      chordConfig,
      setIsLoading,
    ])

    // このuseEffectは不要 - fetchDataとfetchDataChordがローディング状態を管理する
    // useEffect(() => {
    //   if (urlArray && urlArray.length >= 2) {
    //     // 両方の値が空でない場合のみローディング開始
    //     const [key, scaleOrChord] = urlArray
    //     if (
    //       key &&
    //       scaleOrChord &&
    //       key.trim() !== '' &&
    //       scaleOrChord.trim() !== ''
    //     ) {
    //       setIsLoading(true)
    //     } else {
    //       // URLArrayが空の場合はローディングを停止
    //       setIsLoading(false)
    //     }
    //   } else {
    //     // URLArrayがない場合もローディングを停止
    //     setIsLoading(false)
    //   }
    // }, [urlArray, setIsLoading])

    const handleRetry = useCallback(() => {
      setError(null)
      if (array) {
        fetchSearchData(scaleConfig)
      } else if (arrayChord) {
        fetchSearchData(chordConfig)
      }
    }, [array, arrayChord, fetchSearchData, scaleConfig, chordConfig])

    // リンクリストをメモ化
    const list = useMemo(() => {
      return displayResult
        .map((elm) => {
          if (array && elm.key && elm.scale) {
            // convertScaleの型安全なアクセス
            const scaleLabel = convertScale[elm.scale as ScaleType] || elm.scale
            return (
              <Link
                href={`/scaleSearch/${encodeURIComponent(
                  elm.key + '-' + elm.scale
                )}`}
                className="text-gray-700 no-underline"
                key={elm.key + elm.scale}
              >
                <p key={elm.key + elm.scale}>
                  {elm.key}-{scaleLabel + t.SELECTED_SCALE}
                </p>
              </Link>
            )
          } else if (arrayChord && elm.root && elm.type) {
            return (
              <Link
                href={`/chordSearch/${encodeURIComponent(
                  elm.root + '-' + elm.type
                )}`}
                className="text-gray-700 no-underline"
                key={elm.root + elm.type}
              >
                <p key={elm.root + elm.type}>
                  {elm.root}
                  {elm.type === 'major' ? '' : elm.type}
                </p>
              </Link>
            )
          }
          return null
        })
        .filter(Boolean)
    }, [displayResult, array, arrayChord, convertScale, t.SELECTED_SCALE])

    // ローディングコンポーネントをメモ化
    const loadingComponent = useMemo(
      () => (
        <div className="display-container">
          <div className="display-sub-container">
            <LoadingSpinner message="検索中..." />
          </div>
        </div>
      ),
      []
    )

    // shouldShowNoResultsのメモ化 - 早期return文の前に配置
    const shouldShowNoResults = useMemo(() => {
      // URLArrayから直接表示している場合は「結果なし」を表示しない
      if (urlArray && urlArray.length >= 2 && urlArray[0] && urlArray[1]) {
        return false
      }

      // データが存在しているが検索結果がない場合のみ「結果なし」を表示
      const hasActiveNotes = () => {
        if (array) {
          const rangeArr = Object.values(array).slice(2)
          return rangeArr.some((element) => element === true)
        }
        if (arrayChord) {
          const rangeArr = Object.values(arrayChord).slice(2)
          return rangeArr.some((element) => element === true)
        }
        return false
      }

      return hasActiveNotes() && list.length === 0
    }, [urlArray, array, arrayChord, list])

    if (error) {
      return (
        <div className="display-container">
          <div className="display-sub-container">
            <ApiErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        </div>
      )
    }

    if (isLoading) {
      return loadingComponent
    }

    return (
      <div className="display-container">
        <div className="display-sub-container">
          {list.length > 0 ? (
            list
          ) : shouldShowNoResults ? (
            <p>結果が見つかりませんでした</p>
          ) : null}
        </div>
      </div>
    )
  }
)

DisplayScaleAndKey.displayName = 'DisplayScaleAndKey'

export default DisplayScaleAndKey
