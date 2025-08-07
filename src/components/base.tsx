import React from 'react'
import SearchBase from './common/SearchBase'
import type { BaseComponentProps } from '../types'

const ScaleSearch: React.FC<BaseComponentProps> = ({ urlArray }) => {
  return <SearchBase urlArray={urlArray} searchType="scale" />
}

export default ScaleSearch
