import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

const DIFFICULTIES = {
  EASY: { GRAVITY: 1.2, PIPE_SPEED: 1.5, PIPE_GAP: 180, PIPE_INTERVAL: 3500 },
  MEDIUM: { GRAVITY: 1.5, PIPE_SPEED: 2, PIPE_GAP: 150, PIPE_INTERVAL: 3000 },
  HARD: { GRAVITY: 1.8, PIPE_SPEED: 2.5, PIPE_GAP: 130, PIPE_INTERVAL: 2500 }
};

const BALL_SKINS = {
  CLASSIC: {
    background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #ffa500 100%)',
    shadow: 'rgba(255, 215, 0, 0.4)'
  },
  NEON: {
    background: 'radial-gradient(circle at 30% 30%, #ff00ff 0%, #00ffff 100%)',
    shadow: 'rgba(255, 0, 255, 0.4)'
  },
  RAINBOW: {
    background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
    shadow: 'rgba(255, 255, 255, 0.4)'
  },
  METAL: {
    background: 'linear-gradient(45deg, #808080 0%, #c0c0c0 50%, #808080 100%)',
    shadow: 'rgba(192, 192, 192, 0.4)'
  }
};

const ACHIEVEMENTS = {
  BEGINNER: { id: 'BEGINNER', name: 'First Flight', description: 'Score your first point', requirement: 1 },
  INTERMEDIATE: { id: 'INTERMEDIATE', name: 'Getting Better', description: 'Score 10 points', requirement: 10 },
  EXPERT: { id: 'EXPERT', name: 'Ball Master', description: 'Score 25 points', requirement: 25 },
  LEGEND: { id: 'LEGEND', name: 'Legendary', description: 'Score 50 points', requirement: 50 },
  SURVIVOR: { id: 'SURVIVOR', name: 'Survivor', description: 'Play 10 games', requirement: 10 }
};

const SOUNDS = {
  jump: '/sounds/jump.mp3',
  point: '/sounds/point.mp3',
  hit: '/sounds/hit.mp3',
  achievement: '/sounds/achievement.mp3'
};

export function GameProvider({ children }) {
  const [difficulty, setDifficulty] = useState(() => 
    localStorage.getItem('difficulty') || 'MEDIUM'
  );
  const [selectedSkin, setSelectedSkin] = useState(() => 
    localStorage.getItem('selectedSkin') || 'CLASSIC'
  );
  const [highScore, setHighScore] = useState(() => 
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [soundEnabled, setSoundEnabled] = useState(() => 
    localStorage.getItem('soundEnabled') !== 'false'
  );
  const [achievements, setAchievements] = useState(() => 
    JSON.parse(localStorage.getItem('achievements')) || {}
  );
  const [gamesPlayed, setGamesPlayed] = useState(() => 
    parseInt(localStorage.getItem('gamesPlayed')) || 0
  );

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('selectedSkin', selectedSkin);
    localStorage.setItem('highScore', highScore.toString());
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('gamesPlayed', gamesPlayed.toString());
  }, [difficulty, selectedSkin, highScore, soundEnabled, achievements, gamesPlayed]);

  const playSound = (soundName) => {
    if (soundEnabled && SOUNDS[soundName]) {
      const audio = new Audio(SOUNDS[soundName]);
      audio.play().catch(error => console.log('Audio play failed:', error));
    }
  };

  const checkAchievements = (score) => {
    const newAchievements = { ...achievements };
    let earned = false;

    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!achievements[achievement.id]) {
        if (
          (achievement.id === 'SURVIVOR' && gamesPlayed >= achievement.requirement) ||
          (achievement.id !== 'SURVIVOR' && score >= achievement.requirement)
        ) {
          newAchievements[achievement.id] = {
            ...achievement,
            earned: true,
            earnedAt: new Date().toISOString()
          };
          earned = true;
        }
      }
    });

    if (earned) {
      setAchievements(newAchievements);
      playSound('achievement');
    }
  };

  const updateHighScore = (score) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const incrementGamesPlayed = () => {
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    checkAchievements(0); // Check for SURVIVOR achievement
  };

  const value = {
    difficulty,
    setDifficulty,
    selectedSkin,
    setSelectedSkin,
    highScore,
    updateHighScore,
    soundEnabled,
    setSoundEnabled,
    achievements,
    checkAchievements,
    gamesPlayed,
    incrementGamesPlayed,
    playSound,
    DIFFICULTIES,
    BALL_SKINS,
    ACHIEVEMENTS
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 