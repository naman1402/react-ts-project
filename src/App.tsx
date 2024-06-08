import { useCallback, useEffect, useState } from "react";
import words from "./Words.json";
import { HangmanFigure } from "./HangmanFigure";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  // WordToGuess is the current state value which reflects the initial value during first render
  // setWordToGuess is used to update the state and trigger a re-render of the component
  // input of useState is the initial value of WordToGuess
  const [WordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  // guessedLetter is set by user input, incorrectLetter are all letter that were guessed but were not in the wordToGuess
  const incorrectLetters = guessedLetters.filter(letter => !WordToGuess.includes(letter))
  // all attempts are finished
  const isLoser = incorrectLetters.length >= 6 
  // if the letter of words are in the guessesLetter, then win
  const isWinner = WordToGuess.split("").every(letter => guessedLetters.includes(letter)) 

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if(guessedLetters.includes(letter) || isLoser || isWinner) return // in case of duplicate letter, or game is over
      setGuessedLetters(currentLetters => [...currentLetters, letter]) //  else letter enters the guessedLetters array using setter function
    },
    [guessedLetters, isWinner, isLoser] // dependency array, addGuessedLetter should be recreated only if any of these value change
  )

  // useEffect() is used to handle side effects in functional components
  // dependency array: if the state changes, the effect will re-run (modifying behaviour of the handler)
  useEffect(() => {
     const handler = (e: KeyboardEvent) => {
      const key = e.key
      if(!key.match(/^[a-z]$/)) return 

      e.preventDefault()
      // user has guessed key (keyboard event)
      addGuessedLetter(key)
     }

     document.addEventListener("keypress", handler)
     return () => {
      document.removeEventListener("keypress", handler)
     }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
     const key = e.key
     if(key !== "Enter") return 

     e.preventDefault()
     setGuessedLetters([])
     addGuessedLetter(getWord())
    }

    document.addEventListener("keypress", handler)
    return () => {
     document.removeEventListener("keypress", handler)
    }
 }, [])


  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center"
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner - refresh to try again"}
        {isLoser && "Nice try - refresh to try again"}
      </div>
      <HangmanFigure numberOfGuesses={incorrectLetters.length}/>
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={WordToGuess}  
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => WordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}  
        />
      </div>
    </div>
  )
}

export default App