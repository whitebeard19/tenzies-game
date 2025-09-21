import React from 'react'

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white"
  }

  return (
    <button 
      style={styles}
      onClick={() => props.hold(props.id)}
      aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
      aria-pressed={props.isHeld}
      >{props.value}</button>
  )
}
