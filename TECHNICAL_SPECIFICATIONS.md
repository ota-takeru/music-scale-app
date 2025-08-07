# Music Scale App - 技術仕様書

## 概要

音楽のスケールとコードを検索・表示する Next.js アプリケーション。静的サイト生成（SSG）による SEO 最適化と、個別 URL でのアクセスが可能。多言語対応により、グローバルなユーザーに向けた音楽理論学習ツール。

## 重要な技術仕様

### 1. 多言語対応（i18n）設計

#### 基本方針

- **データベース・API**: 全て英語ベース（`major`, `minor`, `harmonicMinor` など）
- **URL・ルーティング**: 英語ベース（SEO と国際化を考慮）
- **UI 表示**: 多言語対応（日本語、英語、将来的に他言語も対応可能）
- **言語切り替え**: クライアントサイドでの動的切り替え

#### 対応言語

- **English (en)**: デフォルト言語、API・データベースの基準言語
- **日本語 (ja)**: 完全対応
- **将来拡張**: 他言語対応のための拡張可能な設計

#### 言語検出・設定

```javascript
// 言語設定の優先順位
1. ユーザーの手動選択（localStorage に保存）
2. ブラウザ言語設定（navigator.language）
3. デフォルト言語（English）
```

### 2. データベース設計と言語仕様

#### データベース保存形式（英語統一）

```sql
-- 全てのデータは英語形式で統一
-- スケールデータ例
scale_type: 'major', 'minor', 'harmonicMinor', 'melodicMinor'
key_signature: 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'

-- コードデータ例
chord_type: 'major', 'minor', 'diminished', 'augmented', 'major7', 'minor7'
root_note: 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
```

#### API レスポンス形式

```javascript
// fetchKey API レスポンス例
{
  key: 'C',                    // 英語形式
  scale: 'major',              // 英語形式
  notes: {                     // 各音符のon/off
    a: false,
    a_sharp: false,
    b: false,
    c: true,
    c_sharp: false,
    d: true,
    d_sharp: false,
    e: true,
    f: false,
    f_sharp: false,
    g: true,
    g_sharp: false
  }
}

// fetchChordsWithName API レスポンス例
{
  root: 'C',                   // 英語形式
  type: 'major',               // 英語形式
  notes: { /* 音符データ */ }
}
```

#### 多言語変換テーブル

```javascript
// src/lib/i18n/translations.js
const TRANSLATIONS = {
  en: {
    scales: {
      major: 'Major',
      minor: 'Minor',
      harmonicMinor: 'Harmonic Minor',
      melodicMinor: 'Melodic Minor',
      majorPentatonic: 'Major Pentatonic',
      minorPentatonic: 'Minor Pentatonic',
      dorian: 'Dorian',
      phrygian: 'Phrygian',
      lydian: 'Lydian',
      mixolydian: 'Mixolydian',
      locrian: 'Locrian',
    },
    chords: {
      major: 'Major',
      minor: 'Minor',
      diminished: 'Diminished',
      augmented: 'Augmented',
      major7: 'Major 7th',
      minor7: 'Minor 7th',
      dominant7: 'Dominant 7th',
    },
  },
  ja: {
    scales: {
      major: 'メジャー',
      minor: 'マイナー',
      harmonicMinor: 'ハーモニックマイナー',
      melodicMinor: 'メロディックマイナー',
      majorPentatonic: 'メジャーペンタトニック',
      minorPentatonic: 'マイナーペンタトニック',
      dorian: 'ドリアン',
      phrygian: 'フリジアン',
      lydian: 'リディアン',
      mixolydian: 'ミクソリディアン',
      locrian: 'ロクリアン',
    },
    chords: {
      major: 'メジャー',
      minor: 'マイナー',
      diminished: 'ディミニッシュ',
      augmented: 'オーギュメント',
      major7: 'メジャーセブンス',
      minor7: 'マイナーセブンス',
      dominant7: 'ドミナントセブンス',
    },
  },
}

// 変換関数
const translateScale = (scaleKey, language = 'en') => {
  return TRANSLATIONS[language]?.scales[scaleKey] || scaleKey
}

const translateChord = (chordKey, language = 'en') => {
  return TRANSLATIONS[language]?.chords[chordKey] || chordKey
}
```

### 3. ルーティング設計（英語ベース）

#### 静的生成される URL（英語統一）

- **スケール**: `/scale/[key]-[englishScaleName]`
  - 例: `/scale/C-major`, `/scale/A-harmonicMinor`
- **コード**: `/chord/[root]-[type]`
  - 例: `/chord/C-major`, `/chord/A-minor`

#### URL 生成プロセス

```javascript
// generateStaticParams での英語ベース URL 生成
export async function generateStaticParams() {
  const combinations = await fetchAllScaleCombinations()

  return combinations.map(({ key, scale }) => ({
    id: `${encodeURIComponent(key)}-${encodeURIComponent(scale)}`,
    // 全て英語形式: 'C-major', 'F#-harmonicMinor' など
  }))
}
```

#### SEO とメタデータ（多言語対応）

```javascript
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [encodedKey, encodedScale] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const scale = decodeURIComponent(encodedScale)

  // 言語に応じたメタデータ生成
  const language = getServerLanguage() // サーバーサイドでの言語検出
  const translatedScale = translateScale(scale, language)

  return {
    title: `${key} ${translatedScale} Scale - Music Scale App`,
    description:
      language === 'ja'
        ? `${key} ${translatedScale}スケールを視覚的に学習できます。ピアノとギターでの表示に対応。`
        : `Explore the ${key} ${translatedScale} scale with interactive piano and guitar visualization.`,
    alternates: {
      languages: {
        en: `/en/scale/${key}-${scale}`,
        ja: `/ja/scale/${key}-${scale}`,
      },
    },
  }
}
```

### 4. コンポーネント階層（多言語対応）

```
pages/
├── [locale]/                     # 言語パス（/en, /ja など）
│   ├── scale/[id]/page.tsx      # 個別スケールページ
│   └── chord/[id]/page.tsx      # 個別コードページ
├── scale/[id]/page.tsx          # デフォルト言語（英語）
└── chord/[id]/page.tsx          # デフォルト言語（英語）

components/
├── base.tsx                      # ScaleSearch wrapper
├── baseChord.tsx                # ChordSearch wrapper
├── common/
│   ├── SearchBase.tsx           # 共通検索ロジック（多言語対応）
│   ├── LanguageSelector.tsx     # 言語切り替えコンポーネント
│   └── withTranslation.tsx      # HOC for translation
├── displayScaleAndKey.tsx       # 検索結果表示（多言語対応）
└── scaleSelector.tsx            # スケール選択UI（多言語対応）

lib/
├── i18n/
│   ├── translations.js          # 翻訳データ
│   ├── index.js                 # i18n メイン設定
│   └── hooks.js                 # useTranslation など
└── utils/
    └── language.js              # 言語検出・変換ユーティリティ
```

#### 多言語対応コンポーネントの実装

```typescript
// src/components/common/LanguageSelector.tsx
'use client'

import { useLanguage } from '@/lib/i18n/hooks'

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage()

  return (
    <select
      value={currentLanguage}
      onChange={(e) => setLanguage(e.target.value)}
      className="language-selector"
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}

// src/lib/i18n/hooks.js
;('use client')

import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children, initialLanguage = 'en' }) {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)

  useEffect(() => {
    // ブラウザ言語設定またはローカルストレージから復元
    const savedLanguage = localStorage.getItem('preferred-language')
    const browserLanguage = navigator.language.split('-')[0]

    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    } else if (translations[browserLanguage]) {
      setCurrentLanguage(browserLanguage)
    }
  }, [])

  const setLanguage = (language) => {
    setCurrentLanguage(language)
    localStorage.setItem('preferred-language', language)
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: [
          { code: 'en', name: 'English' },
          { code: 'ja', name: '日本語' },
        ],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useTranslation() {
  const { currentLanguage } = useLanguage()

  const t = (key, fallback = key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || fallback
  }

  return { t, currentLanguage }
}
```

### 5. データフロー（多言語対応）

#### 個別ページアクセス時（多言語対応フロー）

```mermaid
graph TD
    A[URL Access: /scale/C-major] --> B[Page Component]
    B --> C[Extract: key='C', scale='major']
    C --> D[Detect User Language]
    D --> E[API Call: fetchKey('C', 'major')]
    E --> F[Receive English Data]
    F --> G[Apply Translation: major → 'メジャー']
    G --> H[Display Localized UI]

    D --> I[Set Language Context]
    I --> J[Update URL if needed: /ja/scale/C-major]
```

#### データ変換フロー

```javascript
// 1. URL からのデータ抽出（常に英語）
const [key, scale] = params.id.split('-')  // 'C', 'major'

// 2. API 呼び出し（英語のまま）
const scaleData = await fetchKey(key, scale)  // API は英語で処理

// 3. UI 表示用に翻訳
const { t } = useTranslation()
const displayName = t(`scales.${scale}`)  // 'major' → 'メジャー' (ja) or 'Major' (en)

// 4. コンポーネントでの表示
<h1>{key} {displayName} Scale</h1>  // 'C メジャー Scale' または 'C Major Scale'
```

#### 検索機能の多言語対応

```javascript
// src/components/common/SearchBase.tsx
'use client'

export default function SearchBase({ urlArray }) {
  const { t, currentLanguage } = useTranslation()
  const [selectedKey, setSelectedKey] = useState(urlArray?.[0] || 'C')
  const [selectedScale, setSelectedScale] = useState(urlArray?.[1] || 'major')

  // 検索実行（常に英語でAPI呼び出し）
  const fetchData = async () => {
    try {
      // API呼び出しは英語形式
      const result = await fetchKey(selectedKey, selectedScale)

      // UI表示用に翻訳
      const translatedResult = {
        ...result,
        displayName: t(`scales.${result.scale}`),
      }

      setScaleData(translatedResult)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // スケール選択オプションの生成（翻訳済み）
  const scaleOptions = Object.keys(translations[currentLanguage].scales).map(
    (scaleKey) => ({
      value: scaleKey, // API用の英語キー
      label: t(`scales.${scaleKey}`), // 表示用の翻訳済みテキスト
    })
  )

  return (
    <div>
      <LanguageSelector />

      <select
        value={selectedScale}
        onChange={(e) => setSelectedScale(e.target.value)}
      >
        {scaleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button onClick={fetchData}>{t('search.button', 'Search')}</button>
    </div>
  )
}
```

#### 重要な注意点（多言語対応）

- **データベース・API**: 常に英語形式を維持
- **URL 生成**: 英語ベースで一貫性を保つ
- **翻訳タイミング**: コンポーネントレンダリング時に動的翻訳
- **SEO 最適化**: 言語別の代替 URL 設定
- **状態管理**: 言語変更時の適切なリレンダリング
- **フォールバック**: 翻訳が見つからない場合の英語表示

### 6. Supabase API 設計

#### テーブル構造（推定）

```sql
-- key テーブル
CREATE TABLE key (
  key VARCHAR,      -- 'C', 'A#' など
  scale VARCHAR,    -- 'major', 'minor' など（英語）
  a BOOLEAN,        -- 音符のon/off
  a_sharp BOOLEAN,
  b BOOLEAN,
  c BOOLEAN,
  -- ... 他の音符
);

-- chords テーブル
CREATE TABLE chords (
  root VARCHAR,     -- 'C', 'A#' など
  type VARCHAR,     -- 'major', 'minor' など
  a BOOLEAN,        -- 音符のon/off
  -- ... 他の音符
);
```

### 7. 静的サイト生成（SSG）

#### generateStaticParams

- `fetchAllScaleCombinations()`: 全スケール組み合わせを取得
- `fetchAllChordCombinations()`: 全コード組み合わせを取得
- 両方の値をエンコードして安全な URL 生成

#### メタデータ生成

```typescript
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [encodedKey, encodedScale] = params.id.split('-')
  const key = decodeURIComponent(encodedKey)
  const scale = decodeURIComponent(encodedScale)

  return {
    title: `${key} ${scale} Scale - Music Scale App`,
    description: `Explore the ${key} ${scale} scale with interactive piano and guitar visualization.`,
  }
}
```

### 8. クライアントサイドコンポーネント

#### 'use client' ディレクティブが必要

- `SearchBase.tsx`: useState, useRouter 使用
- `displayScaleAndKey.tsx`: useState, useCallback 使用
- `InstrumentDisplay`: 楽器表示の動的インタラクション

#### サーバーサイドレンダリング

- 個別ページのメタデータ生成
- 静的 HTML 生成による SEO 最適化

### 9. 開発時の注意点（多言語対応）

#### デバッグ方法

- **言語状態の追跡**: `useTranslation` フックでの現在言語確認
- **翻訳キーの検証**: 翻訳データの存在確認とフォールバック動作
- **API データ形式**: 常に英語形式でのレスポンス確認
- **静的生成ログ**: 多言語パス生成の確認
- **ブラウザ言語検出**: `navigator.language` の動作確認

#### よくある問題

1. **英語/多言語変換ミス**: データベースは英語、UI は選択言語
2. **翻訳キー不一致**: 翻訳データとコンポーネントでのキー参照
3. **言語切り替え時の状態リセット**: Context 更新時の適切なリレンダリング
4. **SSG/SSR での言語処理**: サーバーサイドでの言語検出制限
5. **URL と言語の不整合**: 英語ベース URL と表示言語の関係

#### 多言語対応の開発ガイドライン

```javascript
// ✅ 良い例: 英語キーをベースとした翻訳
const scaleType = 'major' // データベースから取得
const displayName = t(`scales.${scaleType}`) // 'メジャー' or 'Major'

// ❌ 悪い例: 翻訳済みテキストをAPI呼び出しに使用
const displayName = 'メジャー'
const result = await fetchKey('C', displayName) // エラーになる

// ✅ 良い例: 条件付き翻訳とフォールバック
const translateWithFallback = (key, fallback) => {
  return t(key, fallback || key.split('.').pop())
}

// ✅ 良い例: 言語変更時の URL 更新
const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage)
  // 必要に応じて URL 更新（オプション）
  if (shouldUpdateUrl) {
    router.push(`/${newLanguage}${pathname}`)
  }
}
```

### 10. 環境設定（多言語対応）

#### 必要な環境変数

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 多言語設定
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,ja
```

#### Next.js 設定

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // 多言語ルーティング設定
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    localeDetection: false, // カスタム言語検出を使用
  },
  // 静的最適化
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
```

#### ビルドコマンド

```bash
npm run build     # 多言語対応の静的生成とAPI接続テスト
npm start         # 本番モード起動
npm run dev       # 開発モード（多言語デバッグ有効）
npm run lint      # 翻訳キー整合性チェック含む
```

### 11. パフォーマンス最適化（多言語対応）

#### 実装済み

- **翻訳データの遅延読み込み**: 必要な言語のみロード
- **多言語コンポーネントのメモ化**: React.memo で翻訳結果をキャッシュ
- **静的生成での多言語ページ**: 全言語での事前生成
- **言語切り替え時の部分更新**: Context を使った効率的な更新

#### 今後の改善点

- **翻訳データの分割**: ページ単位での翻訳データ読み込み
- **CDN での多言語アセット配信**: 地域別最適化
- **Service Worker での翻訳キャッシュ**: オフライン対応

---

## トラブルシューティング（多言語対応）

### よくある問題と解決方法

1. **「結果が見つかりませんでした」が英語で表示される**

   - 翻訳キーの確認: `t('search.noResults', 'No results found')`
   - Context Provider の設定確認
   - フォールバック値の適切な設定

2. **言語切り替え後に古いテキストが残る**

   - React Context の更新確認
   - useEffect 依存配列に `currentLanguage` を追加
   - コンポーネントの適切なメモ化

3. **SEO メタデータが翻訳されない**

   - `generateMetadata` での言語検出確認
   - サーバーサイドでの翻訳処理実装
   - 代替言語 URL の設定確認

4. **静的生成で多言語ページが作成されない**

   - `generateStaticParams` での言語パラメータ確認
   - 国際化ルーティング設定の確認
   - ビルドログでの生成ページ数確認

5. **ブラウザ言語が正しく検出されない**

   ```javascript
   // デバッグ用の言語検出確認
   console.log('Browser language:', navigator.language)
   console.log('Available languages:', navigator.languages)
   console.log('Detected language:', detectBrowserLanguage())
   ```

6. **API エラー: 翻訳済みキーでのデータ取得失敗**

   ```javascript
   // ❌ 問題のあるコード
   const selectedScale = 'メジャー' // UI表示値
   const result = await fetchKey('C', selectedScale) // エラー

   // ✅ 修正後
   const selectedScaleKey = 'major' // 英語キー
   const selectedScaleDisplay = t(`scales.${selectedScaleKey}`) // 表示用
   const result = await fetchKey('C', selectedScaleKey) // API用
   ```

### デバッグツール

```javascript
// 開発時の多言語デバッグヘルパー
window.debugI18n = {
  currentLanguage: () => console.log(useLanguage().currentLanguage),
  translations: () => console.log(translations),
  missingKeys: () => {
    // 未翻訳キーの検出
    const missing = []
    // ... 検出ロジック
    console.log('Missing translation keys:', missing)
  },
}
```

---

**作成日**: 2025 年 7 月 18 日  
**最終更新**: 2025 年 7 月 18 日（多言語対応仕様追加）  
**作成者**: AI Assistant
