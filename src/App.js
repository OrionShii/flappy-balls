import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <div className="game-title">
        <h1>FLAPPY BALLS</h1>
        <p className="subtitle">The Bouncy Adventure</p>
      </div>
      <Game />
    </div>
  );
}

export default App;
