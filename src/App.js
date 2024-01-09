import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const wordList = [
  "слово", "яблук", "сонце", "земля", "місто", // Ensure all words are lowercase for consistency
];

function App() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([...Array(6)].map(() => Array(5).fill(null)));

  useEffect(() => {
    inputRefs.current[0][0].focus();
    setTargetWord(wordList[Math.floor(Math.random() * wordList.length)]);
  }, []);

  const handleLetterChange = (event, guessIndex, letterIndex) => {
    if (guessIndex !== currentGuessIndex || gameOver) return;

    const newGuesses = guesses.slice();
    const newGuess = [...(newGuesses[guessIndex] || [])];
    newGuess[letterIndex] = event.target.value.toLowerCase();
    newGuesses[guessIndex] = newGuess.join('');

    setGuesses(newGuesses);

    if (letterIndex < 4 && event.target.value) {
      inputRefs.current[guessIndex][letterIndex + 1].focus();
    }
  };

  const handleKeyDown = (event, guessIndex, letterIndex) => {
    if (guessIndex !== currentGuessIndex || gameOver) return;

    if (event.key === "Backspace" && letterIndex > 0 && !guesses[guessIndex][letterIndex]) {
      inputRefs.current[guessIndex][letterIndex - 1].focus();
    } else if (event.key === "Enter" && guesses[guessIndex].length === 5) {
      if (wordList.includes(guesses[guessIndex])) {
        if (guesses[guessIndex] === targetWord) {
          setGameOver(true);
          setMessage("Congratulations! You've guessed the word!");
        } else if (currentGuessIndex < 5) {
          setCurrentGuessIndex(currentGuessIndex + 1);
          setTimeout(() => inputRefs.current[currentGuessIndex + 1][0].focus(), 0);
        } else {
          setGameOver(true);
          setMessage("Game Over! The correct word was: " + targetWord);
        }
      } else {
        setMessage("There is no such word!");
      }
    }
  };

  const getColor = (letter, index, guessIndex) => {
    if (gameOver && letter) return 'green'; // Make all letters green if game is over and won
    if (!guesses[guessIndex] || !letter || guessIndex !== currentGuessIndex - 1) return ''; 
    letter = letter.toLowerCase();
    if (letter === targetWord[index]) return 'green';
    if (targetWord.includes(letter)) return 'yellow';
    return 'red';
  };

  return (
    <div className="App">
      <h1>Ukrainian Wordle</h1>
      {message && <p>{message}</p>}
      {guesses.map((guess, guessIndex) => (
        <div key={guessIndex} className="guessRow">
          {Array.from({ length: 5 }).map((_, letterIndex) => (
            <input
              key={letterIndex}
              type="text"
              maxLength="1"
              value={(guess[letterIndex] || "").toUpperCase()}
              onChange={(e) => handleLetterChange(e, guessIndex, letterIndex)}
              onKeyDown={(e) => handleKeyDown(e, guessIndex, letterIndex)}
              ref={el => inputRefs.current[guessIndex][letterIndex] = el}
              disabled={guessIndex !== currentGuessIndex || gameOver}
              className={`letterBox ${getColor(guess[letterIndex], letterIndex, guessIndex)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
