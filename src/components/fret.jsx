import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { useConvertKeyName } from '../hooks/useConvertKeyName'

const Fret = ({ isdown, setFinaldata, label }) => {
  const [isDisplay, setIsDisplay] = useState(isdown)
  const [displayNames, setDisplayNames] = useState(false)
  const handleClick = () => {
    setIsDisplay(!isDisplay)
    setFinaldata((prev) => {
      return { ...prev, [label]: !isDisplay }
    })
  }
  const handleMouseOver = () => {
    setDisplayNames(true)
  }
  const handleMouseOut = () => {
    setDisplayNames(false)
  }
  useEffect(() => {
    setIsDisplay(isdown)
  }, [isdown])

  const { SmallToBig } = useConvertKeyName()

  return (
    <StyledFret>
      <PressingFret
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        isDisplay={isDisplay}
      >
        <p>{isDisplay || displayNames ? SmallToBig[label] : null}</p>
      </PressingFret>
    </StyledFret>
  )
}

export default Fret

const StyledFret = styled.div`
  display: flex;
  flex: 1;
  border-right: 2px solid black;
  justify-content: center;
  align-items: center;
  &:first-child {
    border-right: 10px solid black;
  }
`
const PressingFret = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: transparent;  
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ isDisplay }) => isDisplay && `background-color: red;`}}
    &:hover {
        background-color: #ccc;
    }
    &:active {
        background-color: #aaa;
    }
    p {
        font-size: 0.8em;
        padding: 0;
        margin: 0;
        user-select: none;
        @media (max-width: 600px) {
            transform: rotate(-90deg);
        }
    }
`
