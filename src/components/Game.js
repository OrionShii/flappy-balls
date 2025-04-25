import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import Settings from './Settings';
import Achievements from './Achievements';
import '../styles/Game.css';

function Game() {
  const {
    difficulty,
    selectedSkin,
    highScore,
    updateHighScore,
    playSound,
    checkAchievements,
    incrementGamesPlayed,
    DIFFICULTIES,
    BALL_SKINS
  } = useGame();

  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const currentDifficulty = DIFFICULTIES[difficulty];

  const jump = useCallback(() => {
    if (!gameOver && !showSettings && !showAchievements) {
      playSound('jump');
      setBirdVelocity(currentDifficulty.JUMP_FORCE || -10);
      if (!gameStarted) {
        setGameStarted(true);
      }
    }
  }, [gameOver, showSettings, showAchievements, currentDifficulty.JUMP_FORCE, gameStarted, playSound]);

  const resetGame = () => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    incrementGamesPlayed();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      } else if (e.code === 'Escape') {
        if (showSettings) setShowSettings(false);
        if (showAchievements) setShowAchievements(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, showSettings, showAchievements]);

  useEffect(() => {
    let gameLoop;
    if (gameStarted && !gameOver && !showSettings && !showAchievements) {
      gameLoop = setInterval(() => {
        setBirdPosition((position) => {
          const newPosition = position + birdVelocity;
          if (newPosition > 480 || newPosition < 0) {
            setGameOver(true);
            playSound('hit');
            return position;
          }
          return newPosition;
        });

        setBirdVelocity((velocity) => velocity + currentDifficulty.GRAVITY);

        setPipes((currentPipes) => {
          return currentPipes
            .map((pipe) => ({
              ...pipe,
              x: pipe.x - currentDifficulty.PIPE_SPEED,
            }))
            .filter((pipe) => pipe.x > -60);
        });

        // Check for collisions
        pipes.forEach((pipe) => {
          const birdRight = 140; // bird position (100) + width (40)
          const birdLeft = 100;
          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + 60;

          if (
            birdRight > pipeLeft &&
            birdLeft < pipeRight
          ) {
            if (
              birdPosition < pipe.height ||
              birdPosition > pipe.height + currentDifficulty.PIPE_GAP - 30 // subtract bird height
            ) {
              setGameOver(true);
              playSound('hit');
              updateHighScore(score);
            }
          }

          // Score point when passing pipe
          if (!pipe.passed && pipe.x < birdLeft) {
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              playSound('point');
              checkAchievements(newScore);
              return newScore;
            });
            pipe.passed = true;
          }
        });
      }, 20);
    }
    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [gameStarted, gameOver, birdVelocity, pipes, currentDifficulty, showSettings, showAchievements, score, playSound, checkAchievements, updateHighScore]);

  useEffect(() => {
    let pipeInterval;
    if (gameStarted && !gameOver && !showSettings && !showAchievements) {
      pipeInterval = setInterval(() => {
        const minHeight = 50; // Minimum pipe height
        const maxHeight = 300; // Maximum pipe height
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        setPipes((pipes) => [
          ...pipes,
          {
            x: 400,
            height,
            passed: false,
          },
        ]);
      }, currentDifficulty.PIPE_INTERVAL);
    }
    return () => {
      if (pipeInterval) clearInterval(pipeInterval);
    };
  }, [gameStarted, gameOver, currentDifficulty, showSettings, showAchievements]);

  return (
    <div className="window-container">
      <div className="window-titlebar">
        <div className="window-buttons">
          <button className="window-button close" />
          <button className="window-button minimize" />
          <button className="window-button maximize" />
        </div>
        <span className="window-title">Flappy Balls</span>
      </div>
      <div className="game" onClick={jump}>
        <div
          className="bird"
          style={{
            top: `${birdPosition}px`,
            transform: `rotate(${birdVelocity * 2}deg)`,
            background: BALL_SKINS[selectedSkin].background,
            boxShadow: `0 0 20px ${BALL_SKINS[selectedSkin].shadow}`,
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
                top: pipe.height + currentDifficulty.PIPE_GAP,
                left: pipe.x,
              }}
            />
          </React.Fragment>
        ))}

        {!gameStarted && (
          <div className="start-message">
            <p>Click or Press Space to Start</p>
            <p>High Score: {highScore}</p>
            <div className="menu-buttons">
              <button onClick={(e) => {
                e.stopPropagation();
                setShowSettings(true);
              }}>⚙️ Settings</button>
              <button onClick={(e) => {
                e.stopPropagation();
                setShowAchievements(true);
              }}>🏆 Achievements</button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            {score > highScore && <p className="new-high-score">New High Score! 🏆</p>}
            {score <= highScore && <p>High Score: {highScore}</p>}
            <div className="menu-buttons">
              <button onClick={resetGame}>Try Again</button>
              <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>
              <button onClick={() => setShowAchievements(true)}>🏆 Achievements</button>
            </div>
          </div>
        )}

        <div className="score">Score: {score}</div>
        
        {gameStarted && !gameOver && (
          <div className="menu-icon" onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
          }}>
            ⚙️
          </div>
        )}
      </div>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showAchievements && <Achievements onClose={() => setShowAchievements(false)} />}
    </div>
  );
}

export default Game; 