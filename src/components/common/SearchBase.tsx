'use client'
import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  useRef,
} from 'react'
import { useRouter } from 'next/navigation'
import Container from '../container'
import SubContainer from '../subContainer'
import KeySelector from '../keySelector'
import ScaleSelector from '../scaleSelector'
import ChordSelector from '../chordSelector'
import { useLocale } from '../../hooks/useLocale'
import { useMusicData } from '../../hooks/useMusicData'
import { fetchKey, fetchChordsWithName } from '../../api'
import { buildMusicRouteId, normalizeScaleValue } from '../../utils/musicRoutes'
import type {
  BaseComponentProps,
  ScaleData,
  ChordData,
  MusicData,
  ApiResponse,
} from '../../types'

// 動的インポートでコード分割（エラーハンドリング付き）
const DisplayScaleAndKey = lazy(() =>
  import('../displayScaleAndKey').catch(() => ({
    default: () => <div>コンポーネントの読み込みに失敗しました</div>,
  })),
)

const InstrumentDisplay = lazy(() =>
  import('./InstrumentDisplay').catch(() => ({
    default: () => <div>楽器表示の読み込みに失敗しました</div>,
  })),
)

// ローディングプレースホルダー
const LoadingPlaceholder: React.FC<{ type: string; loadingLabel: string }> = ({
  type,
  loadingLabel,
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2">
      {type} {loadingLabel}
    </span>
  </div>
)

type SearchType = 'scale' | 'chord'

interface SearchBaseProps extends BaseComponentProps {
  searchType: SearchType
}

// 検索設定の型定義
interface SearchConfig {
  apiFunction: (
    key: string,
    value: string,
  ) => Promise<ApiResponse<ScaleData[]> | ApiResponse<ChordData[]>>
  basePath: string
  normalizeValue?: (value: string) => string
  debugPrefix: string
}

// 検索タイプ別の設定
const searchConfigs: Record<SearchType, SearchConfig> = {
  scale: {
    apiFunction: fetchKey,
    basePath: 'scaleSearch',
    normalizeValue: normalizeScaleValue,
    debugPrefix: 'Scale',
  },
  chord: {
    apiFunction: fetchChordsWithName,
    basePath: 'chordSearch',
    debugPrefix: 'Chord',
  },
}

const getInitialSelection = (urlArray: string[], searchType: SearchType) => {
  const [key = '', rawValue = ''] = urlArray

  return {
    key,
    secondValue:
      searchType === 'scale' ? normalizeScaleValue(rawValue) : rawValue,
  }
}

const getSelectionSignature = (key: string, value: string) =>
  `${key}\u0000${value}`

const SearchBase: React.FC<SearchBaseProps> = ({
  urlArray,
  searchType,
  initialData,
}) => {
  const router = useRouter()
  const { t } = useLocale()
  const skippedInitialFetch = useRef(false)
  const initialSelection = useMemo(
    () => getInitialSelection(urlArray, searchType),
    [urlArray, searchType],
  )
  const initialSelectionSignature = useMemo(
    () =>
      getSelectionSignature(initialSelection.key, initialSelection.secondValue),
    [initialSelection],
  )

  // 統一的な音楽データ管理
  const { musicData, setMusicData, scaleData, chordData } = useMusicData({
    mode: searchType,
    initialData: initialData ?? undefined,
  })

  // 共通state - URL からの初期値を設定
  const [selectedKey, setSelectedKey] = useState(() => {
    return initialSelection.key
  })
  const [selectedSecondValue, setSelectedSecondValue] = useState(() => {
    return initialSelection.secondValue
  })

  // 共通データ取得関数
  const fetchData = useCallback(
    async (key: string, secondValue: string) => {
      if (!key || !secondValue) return

      const config = searchConfigs[searchType]
      const normalizedValue = config.normalizeValue
        ? config.normalizeValue(secondValue)
        : secondValue

      try {
        // 統一されたAPI呼び出し
        const response = await config.apiFunction(key, normalizedValue)

        if (response.success && response.data && response.data.length > 0) {
          setMusicData(response.data[0] as MusicData)
        } else if (!response.success) {
          console.error(
            `Error in ${config.debugPrefix.toLowerCase()} search:`,
            response.error,
          )
          return
        }

        // 統一されたナビゲーション処理
        router.push(
          `/${config.basePath}/${buildMusicRouteId(key, normalizedValue)}`,
        )
      } catch (error) {
        console.error(
          `Unexpected error in ${config.debugPrefix.toLowerCase()} search:`,
          error,
        )
      }
    },
    [searchType, router, setMusicData],
  )

  // データ取得の実行
  useEffect(() => {
    if (selectedKey && selectedSecondValue) {
      const isInitialServerSelection =
        !!initialData &&
        getSelectionSignature(selectedKey, selectedSecondValue) ===
          initialSelectionSignature

      if (!skippedInitialFetch.current && isInitialServerSelection) {
        skippedInitialFetch.current = true
        return
      }

      fetchData(selectedKey, selectedSecondValue)
    }
  }, [
    selectedKey,
    selectedSecondValue,
    fetchData,
    initialData,
    initialSelectionSignature,
  ])

  const displayProps = useMemo(
    () => ({
      ...(searchType === 'scale'
        ? { array: (musicData as ScaleData) || undefined }
        : { arrayChord: (musicData as ChordData) || undefined }),
      urlArray: [selectedKey, selectedSecondValue],
    }),
    [searchType, musicData, selectedKey, selectedSecondValue],
  )

  const instrumentProps = useMemo(() => {
    // 統一的なインターフェースを使用
    const currentData = searchType === 'scale' ? scaleData : chordData
    if (currentData) {
      return {
        musicData: currentData,
        setMusicData,
      }
    }
    // データがない場合は undefined を提供
    return {
      musicData: undefined,
      setMusicData,
    }
  }, [searchType, scaleData, chordData, setMusicData])

  return (
    <>
      <Container>
        <SubContainer
          isresponsive="false"
          className="search-intro-container"
        >
          <div className="search-intro-copy">
            <h1>{searchType === 'scale' ? t.SCALE_TITLE : t.CHORD_TITLE}</h1>
            <p>
              {searchType === 'scale'
                ? t.DESCRIPTION_SCALE
                : t.DESCRIPTION_CHORD}
            </p>
          </div>
          <div className="search-controls">
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
          </div>
        </SubContainer>

        <SubContainer isresponsive="true" className="search-results-container">
          <Suspense
            fallback={
              <LoadingPlaceholder type={t.RESULT} loadingLabel={t.LOADING} />
            }
          >
            <DisplayScaleAndKey {...displayProps} />
          </Suspense>
          <Suspense
            fallback={
              <LoadingPlaceholder
                type={t.INSTRUMENT}
                loadingLabel={t.LOADING}
              />
            }
          >
            <InstrumentDisplay {...instrumentProps} />
          </Suspense>
        </SubContainer>
      </Container>
    </>
  )
}

export default SearchBase
