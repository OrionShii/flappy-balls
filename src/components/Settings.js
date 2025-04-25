import React from 'react';
import { useGame } from '../context/GameContext';
import '../styles/Settings.css';

function Settings({ onClose }) {
  const {
    difficulty,
    setDifficulty,
    selectedSkin,
    setSelectedSkin,
    soundEnabled,
    setSoundEnabled,
    DIFFICULTIES,
    BALL_SKINS,
    playSound
  } = useGame();

  const handleSkinChange = (skin) => {
    setSelectedSkin(skin);
    playSound('point');
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    playSound('point');
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled) {
      playSound('point');
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Difficulty</h3>
          <div className="difficulty-options">
            {Object.keys(DIFFICULTIES).map((diff) => (
              <button
                key={diff}
                className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Ball Skin</h3>
          <div className="skin-options">
            {Object.entries(BALL_SKINS).map(([skin, style]) => (
              <div
                key={skin}
                className={`skin-preview ${selectedSkin === skin ? 'active' : ''}`}
                style={{
                  background: style.background,
                  boxShadow: `0 0 20px ${style.shadow}`
                }}
                onClick={() => handleSkinChange(skin)}
              />
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Sound</h3>
          <button
            className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
            onClick={handleSoundToggle}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default Settings; 