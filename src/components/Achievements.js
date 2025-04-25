import React from 'react';
import { useGame } from '../context/GameContext';
import '../styles/Achievements.css';

function Achievements({ onClose }) {
  const { achievements, ACHIEVEMENTS } = useGame();

  return (
    <div className="achievements-overlay">
      <div className="achievements-panel">
        <h2>Achievements</h2>
        
        <div className="achievements-grid">
          {Object.values(ACHIEVEMENTS).map((achievement) => {
            const earned = achievements[achievement.id];
            return (
              <div
                key={achievement.id}
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {earned ? '🏆' : '🔒'}
                </div>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {earned && (
                  <div className="earned-date">
                    Earned: {new Date(earned.earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default Achievements; 