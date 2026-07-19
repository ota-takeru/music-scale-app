'use client'
import { useParams } from 'next/navigation'
import type { LocaleTexts } from '../types'
import en from '../locales/en'
import ja from '../locales/ja'

interface UseLocaleReturn {
  locale: string
  t: LocaleTexts
}

export const useLocale = (): UseLocaleReturn => {
  const params = useParams()
  const locale = (params?.locale as string) || 'ja' // デフォルトロケール
  const t = locale === 'en' ? en : ja
  return { locale, t }
}
