import React, { useEffect, useState, useRef } from 'react'
import Die from '../components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function Main() {

    const[dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)
    const[timeLeft, setTimeLeft] = useState(60)
    const [gameOver, setGameOver] = useState(false)

    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

    //timer effect
    useEffect(() =>{
        if(gameWon || gameOver) return
        if(timeLeft <= 0){
            setGameOver(true)
            return
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev-1)
        },1000)

        return () => clearInterval(timerId)
    },[timeLeft, gameWon, gameOver])

    useEffect(() => {
        if(gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
        }))
    }
    
    function rollDice() {
        if(!gameWon && !gameOver){
            setDice(oldDice => oldDice.map(die => die.isHeld ? die : {...die, value: Math.ceil(Math.random() * 6)}))
        }
        else {
            setDice(generateAllNewDice())
            setTimeLeft(60)
            setGameOver(false)
        }
    }

    function hold(id){
        setDice(oldDice => oldDice.map(die =>  die.id === id ? 
                    {...die, isHeld: !die.isHeld} : die 
            )
        )
    }

    const diceElements = dice.map(dieObj => (
        <Die 
            key={dieObj.id} 
            value={dieObj.value} 
            isHeld={dieObj.isHeld}
            hold={hold}
            id={dieObj.id} 
        />))

  return (
    <main>
        {gameWon && <Confetti />}

        
        <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '20px', fontWeight: 'bold', color: "red" }}>
                ⏳ {timeLeft}s
        </div>

        <div aria-live='polite'>
            {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            {gameOver && !gameWon && <p>⏰ Time’s up! You lose. Press "New Game" to try again.</p>}

        </div>
        <h1 className='title'>Tenzies</h1>
        <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='dice-container'>
            {diceElements}
        </div>
        <button ref={buttonRef} className='roll-dice' onClick={rollDice}>
            {gameWon || gameOver ? "New Game" : "Roll"}
        </button>
    </main>
  )
}
