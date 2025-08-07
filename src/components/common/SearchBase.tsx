'use client'
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Container from '../container'
import SubContainer from '../subContainer'
import Head from '../head'
import KeySelector from '../keySelector'
import ScaleSelector from '../scaleSelector'
import ChordSelector from '../chordSelector'
import { useLocale } from '../../hooks/useLocale'
import { useMusicData } from '../../hooks/useMusicData'
import { fetchKey, fetchChordsWithName } from '../../api'
import type { BaseComponentProps, ScaleData, ChordData } from '../../types'

// 動的インポートでコード分割（エラーハンドリング付き）
const DisplayScaleAndKey = lazy(() =>
  import('../displayScaleAndKey').catch(() => ({
    default: () => <div>コンポーネントの読み込みに失敗しました</div>,
  }))
)

const InstrumentDisplay = lazy(() =>
  import('./InstrumentDisplay').catch(() => ({
    default: () => <div>楽器表示の読み込みに失敗しました</div>,
  }))
)

// エラーバウンダリとローディングコンポーネント
const ErrorBoundary = lazy(() => import('./ErrorBoundary'))

// ローディングプレースホルダー
const LoadingPlaceholder: React.FC<{ type: string }> = ({ type }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2">{type}を読み込み中...</span>
  </div>
)

// 変換テーブル（コンポーネント外で定義）
const SCALE_JAPANESE_TO_ENGLISH = {
  メジャー: 'major',
  マイナー: 'minor',
  ハーモニックマイナー: 'harmonicMinor',
  メロディックマイナー: 'melodicMinor',
  メジャーペンタトニック: 'majorPentatonic',
  マイナーペンタトニック: 'minorPentatonic',
} as const

const SCALE_ENGLISH_TO_JAPANESE = {
  major: 'メジャー',
  minor: 'マイナー',
  harmonicMinor: 'ハーモニックマイナー',
  melodicMinor: 'メロディックマイナー',
  majorPentatonic: 'メジャーペンタトニック',
  minorPentatonic: 'マイナーペンタトニック',
} as const

// エラーフォールバック
const ErrorFallback: React.FC<{ type: string }> = ({ type }) => (
  <div className="text-center p-8 text-red-600">
    <p>{type}の読み込みに失敗しました</p>
  </div>
)

type SearchType = 'scale' | 'chord'

interface SearchBaseProps extends BaseComponentProps {
  searchType: SearchType
}

// 検索設定の型定義
interface SearchConfig {
  apiFunction: (key: string, value: string) => Promise<any>
  basePath: string
  urlTransform?: (value: string) => string
  debugPrefix: string
}

// 検索タイプ別の設定
const searchConfigs: Record<SearchType, SearchConfig> = {
  scale: {
    apiFunction: fetchKey,
    basePath: 'scaleSearch',
    urlTransform: (value) =>
      SCALE_ENGLISH_TO_JAPANESE[
        value as keyof typeof SCALE_ENGLISH_TO_JAPANESE
      ] || value,
    debugPrefix: 'Scale',
  },
  chord: {
    apiFunction: fetchChordsWithName,
    basePath: 'chordSearch',
    debugPrefix: 'Chord',
  },
}

const SearchBase: React.FC<SearchBaseProps> = ({ urlArray, searchType }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLocale()

  // 統一的な音楽データ管理
  const {
    musicData,
    setMusicData,
    scaleData,
    chordData,
    resetData,
    hasNotes,
    title,
  } = useMusicData({ mode: searchType })

  // 共通state - URL からの初期値を設定
  const [selectedKey, setSelectedKey] = useState(() => {
    return urlArray?.length >= 2 ? urlArray[0] : ''
  })
  const [selectedSecondValue, setSelectedSecondValue] = useState(() => {
    if (urlArray?.length >= 2 && searchType === 'scale') {
      return (
        SCALE_JAPANESE_TO_ENGLISH[
          urlArray[1] as keyof typeof SCALE_JAPANESE_TO_ENGLISH
        ] || urlArray[1]
      )
    }
    return urlArray?.length >= 2 ? urlArray[1] : ''
  })

  // 個別ページからの直接アクセスを判定する、より確実な方法
  const isDirectAccess = useMemo(() => {
    // URLに個別ページのパターンが含まれているかチェック
    const isIndividualPage = pathname?.match(
      /\/(scaleSearch|chordSearch)\/[^/]+$/
    )
    // URLArrayが存在し、かつ個別ページのパスの場合
    return urlArray.length >= 2 && !!isIndividualPage
  }, [pathname, urlArray])

  // 共通データ取得関数
  const fetchData = useCallback(
    async (key: string, secondValue: string, skipNavigation = false) => {
      if (!key || !secondValue) return

      const config = searchConfigs[searchType]

      try {
        // 統一されたAPI呼び出し
        const response = await config.apiFunction(key, secondValue)

        if (response.success && response.data && response.data.length > 0) {
          console.log('🔍 API応答データ:', response.data[0])
          console.log('🔍 データのキー:', Object.keys(response.data[0]))
          console.log('🔍 keyプロパティの有無:', 'key' in response.data[0])
          console.log('🔍 scaleプロパティの有無:', 'scale' in response.data[0])
          setMusicData(response.data[0])
        } else if (!response.success) {
          console.error(
            `Error in ${config.debugPrefix.toLowerCase()} search:`,
            response.error
          )
          return
        }

        // 統一されたナビゲーション処理
        if (!isDirectAccess && !skipNavigation) {
          // URL値の変換（必要に応じて）
          const urlValue = config.urlTransform
            ? config.urlTransform(secondValue)
            : secondValue

          router.push(
            `/${config.basePath}/${encodeURIComponent(
              key
            )}-${encodeURIComponent(urlValue)}`
          )
        }
      } catch (error) {
        console.error(
          `Unexpected error in ${config.debugPrefix.toLowerCase()} search:`,
          error
        )
      }
    },
    [searchType, router, setMusicData, isDirectAccess]
  )

  // URL配列からの初期化 - useLayoutEffectでより早いタイミングで実行
  useLayoutEffect(() => {
    if (urlArray.length >= 2) {
      setSelectedKey(urlArray[0])

      // スケール検索の場合、日本語のスケール名を英語に変換
      if (searchType === 'scale' && urlArray[1]) {
        const convertedScale =
          SCALE_JAPANESE_TO_ENGLISH[
            urlArray[1] as keyof typeof SCALE_JAPANESE_TO_ENGLISH
          ] || urlArray[1]
        setSelectedSecondValue(convertedScale)
      } else {
        setSelectedSecondValue(urlArray[1])
      }
    }
  }, [urlArray, searchType])

  // データ取得の実行
  useEffect(() => {
    if (selectedKey && selectedSecondValue) {
      // 初期化時（URLから直接読み込み）はナビゲーションをスキップ
      const skipNavigation = urlArray.length >= 2
      fetchData(selectedKey, selectedSecondValue, skipNavigation)
    }
  }, [selectedKey, selectedSecondValue, fetchData, urlArray.length])

  // メモ化されたプロップス
  const headProps = useMemo(
    () => ({
      title: searchType === 'scale' ? t.SCALE_TITLE : t.CHORD_TITLE,
      descriptions:
        searchType === 'scale' ? t.DESCRIPTION_SCALE : t.DESCRIPTION_CHORD,
      keywords: t.KEYWORDS,
    }),
    [searchType, t]
  )

  const displayProps = useMemo(
    () => ({
      ...(searchType === 'scale'
        ? { array: (musicData as ScaleData) || undefined }
        : { arrayChord: (musicData as ChordData) || undefined }),
      urlArray: [selectedKey, selectedSecondValue],
    }),
    [searchType, musicData, selectedKey, selectedSecondValue]
  )

  const instrumentProps = useMemo(() => {
    // 統一的なインターフェースを使用
    const currentData = searchType === 'scale' ? scaleData : chordData
    console.log('🔍 SearchBase instrumentProps - searchType:', searchType)
    console.log('🔍 SearchBase instrumentProps - scaleData:', scaleData)
    console.log('🔍 SearchBase instrumentProps - chordData:', chordData)
    console.log('🔍 SearchBase instrumentProps - currentData:', currentData)
    if (currentData) {
      console.log('✅ currentDataあり - InstrumentDisplayにデータを渡します')
      return {
        musicData: currentData,
        setMusicData,
      }
    }
    // データがない場合は undefined を提供
    console.log('❌ currentDataなし - InstrumentDisplayにundefinedを渡します')
    return {
      musicData: undefined,
      setMusicData,
    }
  }, [searchType, scaleData, chordData, setMusicData])

  return (
    <>
      <Head {...headProps} />
      <Container>
        <SubContainer isresponsive="false">
          <h1>{searchType === 'scale' ? t.SCALE_TITLE : t.CHORD_TITLE}</h1>
          <p>
            {searchType === 'scale' ? t.DESCRIPTION_SCALE : t.DESCRIPTION_CHORD}
          </p>
          <KeySelector
            label={searchType === 'scale' ? t.SELECTED_KEY : t.SELECTED_ROOT}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
          {searchType === 'scale' ? (
            <ScaleSelector
              selectedScale={selectedSecondValue}
              setSelectedScale={setSelectedSecondValue}
            />
          ) : (
            <ChordSelector
              selectedChord={selectedSecondValue}
              setSelectedChord={setSelectedSecondValue}
            />
          )}
        </SubContainer>

        <SubContainer isresponsive="true">
          <Suspense fallback={<LoadingPlaceholder type="検索結果" />}>
            <DisplayScaleAndKey {...displayProps} />
          </Suspense>
          <Suspense fallback={<LoadingPlaceholder type="楽器" />}>
            <InstrumentDisplay {...instrumentProps} />
          </Suspense>
        </SubContainer>
      </Container>
    </>
  )
}

export default SearchBase
