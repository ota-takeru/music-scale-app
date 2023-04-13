import React from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'
import styled from 'styled-components'

const ResetButton = ({ reset }) => {
  return (
    <Button onClick={reset}>
      <IconContext.Provider value={{ size: '1.5em' }}>
        <HiOutlineRefresh />
      </IconContext.Provider>
    </Button>
  )
}
export default ResetButton

const Button = styled.button`
  width: 60px;
  height: 50px;
  font-size: 20px;
  border-radius: 10px;
  background-color: #aaa;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.1s ease;
  box-shadow: 2px 2px 6px 1px #ddd;
  margin-left: 20px;
  &:hover {
    background-color: #ccc;
    border: 2px solid #ccc;
  }
  @media (max-width: 600px) {
    width: 60%;
    margin: 20px 0 20px 0;
  }
`
