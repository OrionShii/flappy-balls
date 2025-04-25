import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Game.css';

const GRAVITY = 1.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 2;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 3000;

function Game() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdVelocity(JUMP_FORCE);
      if (!gameStarted) {
        setGameStarted(true);
      }
    }
  }, [gameOver, gameStarted]);

  const resetGame = () => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setGameStarted(false);
    setGameOver(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setScore(0);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump]);

  useEffect(() => {
    let gameLoop;
    if (gameStarted && !gameOver) {
      gameLoop = setInterval(() => {
        setBirdPosition((position) => {
          const newPosition = position + birdVelocity;
          if (newPosition > 500 || newPosition < 0) {
            setGameOver(true);
            return position;
          }
          return newPosition;
        });

        setBirdVelocity((velocity) => velocity + GRAVITY);

        setPipes((currentPipes) => {
          return currentPipes
            .map((pipe) => ({
              ...pipe,
              x: pipe.x - PIPE_SPEED,
            }))
            .filter((pipe) => pipe.x > -60);
        });
      }, 20);
    }
    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [gameStarted, gameOver, birdVelocity]);

  useEffect(() => {
    let pipeInterval;
    if (gameStarted && !gameOver) {
      pipeInterval = setInterval(() => {
        const height = Math.random() * (400 - PIPE_GAP);
        setPipes((pipes) => [
          ...pipes,
          {
            x: 400,
            height,
            passed: false,
          },
        ]);
      }, PIPE_INTERVAL);
    }
    return () => {
      if (pipeInterval) clearInterval(pipeInterval);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      pipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x < 100) {
          setScore((score) => score + 1);
          pipe.passed = true;
        }

        if (
          birdPosition < pipe.height ||
          birdPosition > pipe.height + PIPE_GAP
        ) {
          if (pipe.x < 120 && pipe.x > 40) {
            setGameOver(true);
          }
        }
      });
    }
  }, [birdPosition, pipes, gameStarted, gameOver]);

  return (
    <div className="game" onClick={jump}>
      <div
        className="bird"
        style={{
          top: `${birdPosition}px`,
          transform: `rotate(${birdVelocity * 2}deg)`,
        }}
      />

      {pipes.map((pipe, i) => (
        <React.Fragment key={i}>
          <div
            className="pipe top"
            style={{
              height: pipe.height,
              left: pipe.x,
            }}
          />
          <div
            className="pipe bottom"
            style={{
              top: pipe.height + PIPE_GAP,
              left: pipe.x,
            }}
          />
        </React.Fragment>
      ))}

      {!gameStarted && (
        <div className="start-message">
          <p>Click or Press Space to Start</p>
          {highScore > 0 && <p>High Score: {highScore}</p>}
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Score: {score}</p>
          {score > highScore && <p className="new-high-score">New High Score! 🏆</p>}
          {score <= highScore && <p>High Score: {highScore}</p>}
          <button onClick={resetGame}>Try Again</button>
        </div>
      )}

      <div className="score">Score: {score}</div>
    </div>
  );
}

export default Game; 