import React from 'react'
import String from './string'
import styled from 'styled-components'
import { useReset } from '../hooks/useReset'
import ResetButton from './resetButton'

const Fingerboard = (props) => {
  const finaldata = props.finaldata ? props.finaldata : finalchord
  const setFinaldata = props.setFinaldata ? props.setFinaldata : setFinalchord
  const Reset = () => {
    useReset(finaldata, setFinaldata)
  }
  return (
    <Div>
      <Guitar>
        <Board>
        <FretNums> 
        <div style={{ display: 'flex', flex: '1', borderRight: '10px transparent black' }}></div>
        {['', '', '3', '', '5', '', '7', '', '9', '', '', '12  '].map((value) => (
          <Num key={value}><span>{value}</span></Num>
        ))}
      </FretNums>
      <Strings>
        <String finaldata={finaldata} setFinaldata={setFinaldata} n={7} />
          <String finaldata={finaldata} setFinaldata={setFinaldata} n={2} />
          <String finaldata={finaldata} setFinaldata={setFinaldata} n={10} />
          <String finaldata={finaldata} setFinaldata={setFinaldata} n={5} />
          <String finaldata={finaldata} setFinaldata={setFinaldata} n={0} />
          <String finaldata={finaldata} setFinaldata={setFinaldata} n={7} />
        </Strings>
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

  @media (max-width: 600px) {
    transform: rotate(90deg);
  }
`

const Strings = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5deb3;
  width: 100%;
  height: 220px;
  margin: 0 0 20px 0;
`

const FretNums = styled.div`
background-color: transparent;
  display: flex;
  flex-direction: row;
  width:  100%;
  height: 30px;
  position: relative;
  @media (max-width: 600px) {
  }
`

const Num = styled.div`
  display: flex;
  flex: 1;
  border-right: 2px transparent black;
  justify-content: right;
  align-items: center;
  @media (max-width: 600px) {
    span {
      transform: rotate(-90deg);
    }
  }
`


