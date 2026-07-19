import React from 'react'
import SearchBase from './common/SearchBase'
import type { BaseComponentProps } from '../types'

const ChordSearch: React.FC<BaseComponentProps> = ({
  urlArray,
  initialData,
}) => {
  return (
    <SearchBase
      key={`chord:${urlArray.join('-')}`}
      urlArray={urlArray}
      searchType="chord"
      initialData={initialData}
    />
  )
}

export default ChordSearch
