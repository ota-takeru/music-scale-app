import Head from 'next/head'
import React from 'react'

const CustomHead = ( props ) => {
  console.log(props.descriptions)
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={props.descriptions} />
      <meta name="keywords" content={props.keywords} />
    </Head>
  )

} 

export default CustomHead