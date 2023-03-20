export const useConvertKeyName = () => {
  const BigToSmall = {
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
  }

  const SmallToBig = {
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
  }

  return { BigToSmall, SmallToBig }
}
