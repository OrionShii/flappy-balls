# 🎮 Flappy Balls

A modern take on the classic Flappy Bird game, built with React. Guide your bouncing ball through pipes and aim for the highest score!


https://github.com/user-attachments/assets/e28fe319-534e-4939-870e-17cfd0c6baa5



## 🚀 Features

- Smooth, modern UI with gradient effects
- Responsive controls (mouse click or spacebar)
- High score tracking
- Immersive visual effects and animations
- Mobile-friendly design
- Simple yet challenging gameplay

## 🎯 How to Play

1. Click anywhere or press the spacebar to start
2. Keep clicking or pressing spacebar to make the ball bounce
3. Navigate through the pipes without touching them
4. Each pipe passed = 1 point
5. Try to beat your high score!

## 🛠️ Technologies Used

- React
- CSS3 (with modern features like gradients and backdrop-filter)
- JavaScript (ES6+)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/OrionShii/flappy-balls.git
```

2. Navigate to the project directory:
```bash
cd flappy-balls
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:urport) in your browser

## 🎨 Customization

You can easily customize the game by modifying the following constants in `src/components/Game.js`:

```javascript
const GRAVITY = 1.5;        // Adjust ball falling speed
const JUMP_FORCE = -10;     // Adjust jump height
const PIPE_SPEED = 2;       // Adjust pipe movement speed
const PIPE_GAP = 150;       // Adjust gap between pipes
const PIPE_INTERVAL = 3000; // Adjust time between pipes
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Game Controls

- Click/Tap - Make the ball jump
- Spacebar - Make the ball jump
- Any key during game over - Restart the game

## 🏆 Scoring

- +1 point for each pipe passed
- High score is saved during the session
- Try to beat your personal best!

## 🐛 Known Issues

- None reported yet! Feel free to open an issue if you find any.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 👥 Credits

Created with ❤️ by [OrionShii]

---
*Happy Gaming! 🎮*
