import React from 'react'
import String from './string'
import styled from 'styled-components'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'

const Fingerboard = ({ finaldata, setFinaldata }) => {
  const Reset = () => {
    useReset(finaldata, setFinaldata)
  }
  return (
    <Div>
    <Guitar>
      <Board>
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={7} />
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={2} />
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={10} />
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={5} />
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={0} />
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={7} />
      </Board>
    </Guitar>
      <ResetButton reset={Reset} />
    </Div>
  )
}
export default Fingerboard

const Div = styled.div`
display: flex;
justify-content: center;
@media (max-width: 600px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`
const Guitar = styled.div`
  display: flex;
  @media (max-width: 600px) {
    margin: 6.5em 0;  
  }
`
const Board = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5deb3;
  width: 100%;
  height: 220px;
  margin: 0 0 20px 0;
  @media (max-width: 600px) {
    height: 240px;
    transform: rotate(90deg);
    margin: 0;
  }
`
