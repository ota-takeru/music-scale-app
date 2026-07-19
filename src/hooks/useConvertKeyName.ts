import type { KeyNameConverter, NoteName, NoteNameLower } from '../types'

/**
 * 音符名の大文字小文字変換フック
 * 楽器表示とAPI通信で使用される音符名の形式を相互変換
 */
export const useConvertKeyName = (): KeyNameConverter => {
  const BigToSmall: Record<NoteName, NoteNameLower> = {
    A: 'a',
    'A#': 'a_sharp',
    B: 'b',
    C: 'c',
    'C#': 'c_sharp',
    D: 'd',
    'D#': 'd_sharp',
    E: 'e',
    F: 'f',
    'F#': 'f_sharp',
    G: 'g',
    'G#': 'g_sharp',
  } as const

  const SmallToBig: Record<NoteNameLower, NoteName> = {
    a: 'A',
    a_sharp: 'A#',
    b: 'B',
    c: 'C',
    c_sharp: 'C#',
    d: 'D',
    d_sharp: 'D#',
    e: 'E',
    f: 'F',
    f_sharp: 'F#',
    g: 'G',
    g_sharp: 'G#',
  } as const

  return { BigToSmall, SmallToBig }
}
