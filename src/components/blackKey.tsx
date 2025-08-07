import React from 'react'
import PianoKey from './common/PianoKey'
import type { KeyComponentProps } from '../types'

const BlackKey: React.FC<KeyComponentProps> = React.memo((props) => {
  return <PianoKey {...props} keyType="black" />
})

BlackKey.displayName = 'BlackKey'

export default BlackKey
