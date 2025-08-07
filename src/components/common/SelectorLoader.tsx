import React, { lazy, Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

// セレクターコンポーネントの動的インポート
const KeySelector = lazy(() => import('../keySelector'))
const ScaleSelector = lazy(() => import('../scaleSelector'))
const ChordSelector = lazy(() => import('../chordSelector'))

type KeySelectorLoaderProps = {
  type: 'key'
  selectedKey: string
  setSelectedKey: (key: string) => void
  label?: string
}

type ScaleSelectorLoaderProps = {
  type: 'scale'
  selectedScale: string
  setSelectedScale: (scale: string) => void
}

type ChordSelectorLoaderProps = {
  type: 'chord'
  selectedChord: string
  setSelectedChord: (chord: string) => void
}

type SelectorLoaderProps =
  | KeySelectorLoaderProps
  | ScaleSelectorLoaderProps
  | ChordSelectorLoaderProps

const SelectorLoader: React.FC<SelectorLoaderProps> = (props) => {
  return (
    <Suspense
      fallback={
        <LoadingSpinner size="sm" message="セレクターを読み込み中..." />
      }
    >
      {props.type === 'key' && (
        <KeySelector
          selectedKey={props.selectedKey}
          setSelectedKey={props.setSelectedKey}
          label={props.label}
        />
      )}
      {props.type === 'scale' && (
        <ScaleSelector
          selectedScale={props.selectedScale}
          setSelectedScale={props.setSelectedScale}
        />
      )}
      {props.type === 'chord' && (
        <ChordSelector
          selectedChord={props.selectedChord}
          setSelectedChord={props.setSelectedChord}
        />
      )}
    </Suspense>
  )
}

export default SelectorLoader

// 個別エクスポート（必要に応じて直接インポートできるように）
export const LazyKeySelector: React.FC<any> = (props) => (
  <SelectorLoader type="key" {...props} />
)

export const LazyScaleSelector: React.FC<any> = (props) => (
  <SelectorLoader type="scale" {...props} />
)

export const LazyChordSelector: React.FC<any> = (props) => (
  <SelectorLoader type="chord" {...props} />
)
