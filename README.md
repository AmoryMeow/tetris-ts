# Tetris TypeScript

An implementation of the classic Tetris game built with TypeScript and HTML. 


<img src="https://github.com/user-attachments/assets/79d11688-5f60-4956-8ac4-08f2ed309ca4" width="350">


## Description

This is a feature-rich Tetris game that includes modern gameplay mechanics while staying true to the classic Tetris experience. The game features smooth animations, responsive controls, and a scoring system that rewards skilled players.

## Demo

[Play the game here](https://amorymeow.github.io/tetris-ts/)

## How to Run Project

1. Clone the repository:
```bash
git clone https://github.com/amorymeow/tetris-ts.git
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Build for production:
```bash
yarn build
```

5. Preview production build:
```bash
yarn preview
```

## Features

- Classic Tetris gameplay mechanics
- Modern, smooth animations
- Score system:
  - 1 line: 40 × level points
  - 2 lines: 100 × level points
  - 3 lines: 300 × level points
  - 4 lines (Tetris): 1200 × level points
- Level progression system
- High score tracking with local storage
- Next piece preview
- Responsive controls with on-screen buttons
- Pause functionality
- Game over detection
- Smooth piece rotation and movement
- Speed increase with level progression

## Technologies

- TypeScript
- HTML5 DOM
- CSS
- Vite (Build tool)
- Local Storage API for high score persistence

## Game Controls

### Keyboard Controls
- Left Arrow: Move piece left
- Right Arrow: Move piece right
- Down Arrow: Soft drop
- Up Arrow: Rotate piece

### On-screen Controls
- Start/Pause button: Start or pause the game
- Reset button: Reset the game
- Arrow buttons: Move and rotate pieces

## Development

The project is structured using TypeScript classes for better organization and maintainability:

- `Game`: Main game logic and state management
- `Board`: Game board management and grid operations
- `Tetrimino`: Piece management, movement, and rotation
- `Draw`: DOM rendering and UI updates
- `Generator`: Tetrimino generation with 7-bag system
- `Const`: Game constants and configuration

## Project Structure

```
src/
├── script/
│   ├── main.ts          # Entry point and event handlers
│   ├── game.ts          # Main game logic
│   ├── board.ts         # Board management
│   ├── tetrimino.ts     # Piece logic
│   ├── draw.ts          # Rendering
│   ├── generator.ts     # Piece generation
│   └── const.ts         # Constants
├── assets/
│   └── fonts/           # LCD-style fonts
└── style.css            # Game styling
```
