import { useLocale } from './useLocale'
import type { ScaleNameConverter, ScaleType } from '../types'

/**
 * スケール名の多言語変換フック
 * 内部スケール名を現在のロケールに応じた表示名に変換
 */
export const useConvertScaleName = (): ScaleNameConverter => {
  const { t } = useLocale()
  
  const convertScale: ScaleNameConverter = {
    major: t.MAJOR,
    minor: t.MINOR,
    harmonicMinor: t.HARMONIC_MINOR,
    melodicMinor: t.MELODIC_MINOR,
    majorPentatonic: t.MAJOR_PENTATONIC,
    minorPentatonic: t.MINOR_PENTATONIC,
  } as const
  
  return convertScale
}
