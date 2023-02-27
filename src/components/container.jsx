import React from 'react'

const Container = ({ children }) => {
  const style = {
    justifyContent: 'center',
    width: '90em',
    margin: '0 auto',
  }

  return <div style={style}>{children}</div>
}

export default Container
