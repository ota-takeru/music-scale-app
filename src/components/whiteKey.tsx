import React from 'react'
import PianoKey from './common/PianoKey'
import type { KeyComponentProps } from '../types'

const WhiteKey: React.FC<KeyComponentProps> = React.memo((props) => {
  return <PianoKey {...props} keyType="white" />
})

WhiteKey.displayName = 'WhiteKey'

export default WhiteKey
