import React from 'react'
import Styles from '../styles/subContainer.module.css'

const SubContainer = (props) => {
  console.log(props.isresponsive)
  return (
    <div className={Styles.container} isresponsive={props.isresponsive}>
      {props.children}
    </div>
  )
}

export default SubContainer
