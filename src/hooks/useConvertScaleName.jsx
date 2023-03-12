import { useLocale } from './useLocale'

export const useConvertScaleName = () => {
  const { t } = useLocale()
  const convertScale = {
    major: t.MAJOR,
    minor: t.MINOR,
    harmonicMinor: t.HARMONIC_MINOR,
    melodicMinor: t.MELODIC_MINOR,
    majorPentatonic: t.MAJOR_PENTATONIC,
    minorPentatonic: t.MINOR_PENTATONIC,
  }
  return convertScale
}
