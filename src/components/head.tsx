import Head from 'next/head'
import React from 'react'

interface CustomHeadProps {
  title: string
  descriptions?: string
  keywords?: string
}

const CustomHead: React.FC<CustomHeadProps> = ({
  title,
  descriptions,
  keywords,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {descriptions && <meta name="description" content={descriptions} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Head>
  )
}

export default CustomHead
