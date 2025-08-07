import React from 'react'
import SearchBase from './common/SearchBase'
import type { BaseComponentProps } from '../types'

const ChordSearch: React.FC<BaseComponentProps> = ({ urlArray }) => {
  return <SearchBase urlArray={urlArray} searchType="chord" />
}

export default ChordSearch
