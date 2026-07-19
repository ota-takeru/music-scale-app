export const SCALE_ROUTE_ALIASES: Record<string, string> = {
  メジャー: 'major',
  マイナー: 'minor',
  ハーモニックマイナー: 'harmonicMinor',
  メロディックマイナー: 'melodicMinor',
  メジャーペンタトニック: 'majorPentatonic',
  マイナーペンタトニック: 'minorPentatonic',
}

const SCALE_DISPLAY_NAMES: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  harmonicMinor: 'Harmonic Minor',
  melodicMinor: 'Melodic Minor',
  majorPentatonic: 'Major Pentatonic',
  minorPentatonic: 'Minor Pentatonic',
  blues: 'Blues',
}

const CHORD_DISPLAY_NAMES: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  major7: 'Major 7th',
  minor7: 'Minor 7th',
  dominant7: 'Dominant 7th',
  diminished: 'Diminished',
  augmented: 'Augmented',
  sus2: 'Suspended 2nd',
  sus4: 'Suspended 4th',
  '6': '6th',
  '7': '7th',
  '9': '9th',
  '11': '11th',
  '13': '13th',
}

export const normalizeScaleValue = (value: string): string => {
  return SCALE_ROUTE_ALIASES[value] || value
}

export const getScaleDisplayName = (value: string): string => {
  const normalizedValue = normalizeScaleValue(value)
  return SCALE_DISPLAY_NAMES[normalizedValue] || normalizedValue
}

export const getChordDisplayName = (value: string): string => {
  return CHORD_DISPLAY_NAMES[value] || value
}

export const buildMusicRouteId = (root: string, type: string): string => {
  return `${encodeURIComponent(root)}-${encodeURIComponent(type)}`
}

export const buildMusicParamId = (root: string, type: string): string => {
  return `${root}-${type}`
}

export const parseMusicRouteId = (id: string): [string, string] => {
  const separatorIndex = id.indexOf('-')

  if (separatorIndex === -1) {
    return [decodeURIComponent(id), '']
  }

  return [
    decodeURIComponent(id.slice(0, separatorIndex)),
    decodeURIComponent(id.slice(separatorIndex + 1)),
  ]
}
