import React from 'react'
import SearchBase from './common/SearchBase'
import type { BaseComponentProps } from '../types'

const ScaleSearch: React.FC<BaseComponentProps> = ({
  urlArray,
  initialData,
}) => {
  return (
    <SearchBase
      key={`scale:${urlArray.join('-')}`}
      urlArray={urlArray}
      searchType="scale"
      initialData={initialData}
    />
  )
}

export default ScaleSearch
