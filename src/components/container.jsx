import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px;
  // background-color: #ccc;
  border-radius: 10px;
  @media (max-width: 768px) {
    padding: 0;
  }
`
const Container = ({ children }) => {
  return <Div>{children}</Div>
}

export default Container
