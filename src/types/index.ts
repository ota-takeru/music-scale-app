// 音楽データの型定義
export interface MusicNote {
  a: boolean
  a_sharp: boolean
  b: boolean
  c: boolean
  c_sharp: boolean
  d: boolean
  d_sharp: boolean
  e: boolean
  f: boolean
  f_sharp: boolean
  g: boolean
  g_sharp: boolean
}

// 音符名の型定義
export type NoteName =
  | 'A'
  | 'A#'
  | 'B'
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
export type NoteNameLower =
  | 'a'
  | 'a_sharp'
  | 'b'
  | 'c'
  | 'c_sharp'
  | 'd'
  | 'd_sharp'
  | 'e'
  | 'f'
  | 'f_sharp'
  | 'g'
  | 'g_sharp'

// スケール名の型定義
export type ScaleType =
  | 'major'
  | 'minor'
  | 'harmonicMinor'
  | 'melodicMinor'
  | 'majorPentatonic'
  | 'minorPentatonic'

// 音符名変換の型定義
export interface KeyNameConverter {
  BigToSmall: Record<NoteName, NoteNameLower>
  SmallToBig: Record<NoteNameLower, NoteName>
}

// スケール名変換の型定義
export type ScaleNameConverter = Record<ScaleType, string>

// 共通の音楽データ基底インターフェース
export interface BaseMusicData extends MusicNote {
  // 共通のメタデータ
  id?: string
  created_at?: string
  updated_at?: string
}

// スケールデータの型定義
export interface ScaleData extends BaseMusicData {
  key: string
  scale: string
}

// コードデータの型定義
export interface ChordData extends BaseMusicData {
  root: string
  type: string
}

// 音楽データの汎用型（ScaleDataまたはChordData）
export type MusicData = ScaleData | ChordData

// セレクターオプションの型定義
export interface SelectOption {
  value: string
  label: string
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  success: boolean
}

// APIエラーの型定義
export interface ApiError {
  message: string
  code?: string
  details?: unknown
  statusCode?: number
}

// API結果の型定義（関数の戻り値用）
export type ApiResult<T> = Promise<ApiResponse<T>>

// 検索結果の型定義
export interface SearchResult {
  key?: string
  scale?: string
  root?: string
  type?: string
}

// ロケール型定義
export interface LocaleTexts {
  HOME_TITLE: string
  SCALE_TITLE: string
  CHORD_TITLE: string
  SELECTED_KEY: string
  SELECTED_SCALE: string
  SELECTED_CHORD: string
  SELECTED_ROOT: string
  RESULT: string
  SEARCH: string
  MINOR: string
  MAJOR: string
  HARMONIC_MINOR: string
  MELODIC_MINOR: string
  MAJOR_PENTATONIC: string
  MINOR_PENTATONIC: string
  BLUES: string
  DESCRIPTION_SCALE: string
  DESCRIPTION_CHORD: string
  KEYWORDS: string
  DESCRIPTIONS_HOME: string
  THREE_CHORDS: string
  FOUR_CHORDS: string
  OTHERS: string
  TITLE?: string
}

// 共通のコンポーネントプロパティの型定義
export interface BaseComponentProps {
  urlArray: string[]
}

// 統一的な音楽データコンポーネントプロパティ
export interface MusicDataProps {
  musicData: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  className?: string
  disabled?: boolean
}

// displayScaleAndKey用のプロパティ
export interface DisplayScaleAndKeyProps {
  array?: ScaleData
  arrayChord?: ChordData
  urlArray: string[]
}

// Fingerboard用のプロパティ（従来のAPIとの互換性のため）
export interface FingerboardProps {
  finaldata?: ScaleData | ChordData
  setFinaldata?: (
    data:
      | ScaleData
      | ChordData
      | ((prev: ScaleData | ChordData) => ScaleData | ChordData)
  ) => void
}

// ヘッダーコンポーネント用のプロパティ
export interface HeaderProps {
  href?: string
  title?: string
}

// Headコンポーネント用のプロパティ
export interface HeadProps {
  title: string
  descriptions?: string
  keywords?: string
}

// ピアノキーの統一的な型定義
export interface PianoKeyProps {
  isdown: string
  isPrimaryKey: string
  setPrimaryKey: (keys: string[]) => void
  primaryKey: string[]
  label: string
  n: number
  musicData?: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  keyType: 'white' | 'black'
  className?: string
  disabled?: boolean
}

// PianoRollの統一的な型定義
export interface PianoRollProps {
  musicData?: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  className?: string
}

// PianoAppearanceの統一的な型定義
export interface PianoAppearanceProps {
  primaryKey: string[]
  setPrimaryKey: (value: string[]) => void
  musicData?: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  className?: string
}

// InstrumentDisplayの統一的な型定義
export interface InstrumentDisplayProps {
  musicData?: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  className?: string
}

// WhiteKey/BlackKeyの統一的な型定義
export interface KeyComponentProps {
  isdown: string
  isPrimaryKey: string
  setPrimaryKey: (value: string[]) => void
  primaryKey: string[]
  label: string
  n: number
  musicData?: MusicData
  setMusicData: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  className?: string
}

// フレットの型定義（Fingerboardとの互換性のため一時的に保持）
export interface FretProps {
  isdown: boolean
  setFinaldata: (
    data:
      | ScaleData
      | ChordData
      | ((prev: ScaleData | ChordData) => ScaleData | ChordData)
  ) => void
  label: string
  className?: string
  disabled?: boolean
}

// リセット機能の統一的な型定義
export interface ResetHookProps {
  musicData?: MusicData
  setMusicData?: (data: MusicData | ((prev: MusicData) => MusicData)) => void
  primaryKey?: string[]
  setPrimaryKey?: (keys: string[]) => void
}

// 音楽データのヘルパー関数の型定義
export interface MusicDataUtils {
  isScaleData: (data: MusicData) => data is ScaleData
  isChordData: (data: MusicData) => data is ChordData
  getNotesFromData: (data: MusicData) => string[]
  resetMusicData: (data: MusicData) => MusicData
  createEmptyScaleData: () => ScaleData
  createEmptyChordData: () => ChordData
}
