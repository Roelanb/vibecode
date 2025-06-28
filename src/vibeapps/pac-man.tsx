import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GameContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  padding: '20px',
  borderRadius: '8px',
  position: 'relative',
  width: '100%',
  height: '100%',
});

const GameScreen = styled(Box)({
  position: 'relative',
  width: '560px', // 28 tiles * 20px
  height: '620px', // 31 tiles * 20px
  backgroundColor: '#000',
  border: '2px solid #1976d2',
  display: 'grid',
  gridTemplateColumns: 'repeat(28, 20px)',
  gridTemplateRows: 'repeat(31, 20px)',
});

const Wall = styled(Box)({
  width: '20px',
  height: '20px',
  backgroundColor: '#1976d2',
  boxShadow: 'inset 0 0 5px #0d47a1',
});

const Pellet = styled(Box)({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    width: '4px',
    height: '4px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 2px #fff',
  },
});

const Player = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  width: '20px',
  height: '20px',
  position: 'absolute',
  backgroundColor: '#ff0',
  borderRadius: '50%',
  clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 50% 50%, 100% 60%, 100% 100%, 0% 100%)',
  transform: `rotate(${rotation}deg)`,
  transition: 'transform 0.1s linear',
}));

const Ghost = styled(Box)<{ color: string }>(({ color }) => ({
  width: '20px',
  height: '20px',
  position: 'absolute',
  backgroundColor: color,
  borderRadius: '50% 50% 0 0',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    top: '6px',
    left: '4px',
    boxShadow: '8px 0 0 #fff',
  },
}));

// 0 = Pellet, 1 = Wall
const mazeLayout = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const initialGhosts = [
  { x: 13, y: 11, color: '#f00', direction: 'left' }, // Blinky (red)
  { x: 14, y: 11, color: '#ffb8de', direction: 'right' }, // Pinky (pink)
  { x: 13, y: 14, color: '#0ff', direction: 'up' }, // Inky (cyan)
  { x: 14, y: 14, color: '#ffb852', direction: 'down' }, // Clyde (orange)
];

const Pacman: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: 14, y: 23 });
  const [direction, setDirection] = useState('left');
  const [rotation, setRotation] = useState(180);
  const [maze, setMaze] = useState(mazeLayout);
  const [score, setScore] = useState(0);
  const [ghosts, setGhosts] = useState(initialGhosts);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    switch (e.key) {
      case 'ArrowUp': setDirection('up'); setRotation(-90); break;
      case 'ArrowDown': setDirection('down'); setRotation(90); break;
      case 'ArrowLeft': setDirection('left'); setRotation(180); break;
      case 'ArrowRight': setDirection('right'); setRotation(0); break;
    }
  }, [gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      // Move Player
      setPlayerPos(prevPos => {
        const newPos = { ...prevPos };
        switch (direction) {
          case 'up': newPos.y--; break;
          case 'down': newPos.y++; break;
          case 'left': newPos.x--; break;
          case 'right': newPos.x++; break;
        }

        if (newPos.x < 0) newPos.x = 27;
        if (newPos.x > 27) newPos.x = 0;

        if (maze[newPos.y]?.[newPos.x] === 1) return prevPos;

        if (maze[newPos.y]?.[newPos.x] === 0) {
          setScore(s => s + 10);
          const newMaze = maze.map(r => [...r]);
          newMaze[newPos.y][newPos.x] = 2;
          setMaze(newMaze);
        }

        return newPos;
      });

      // Move Ghosts
      setGhosts(prevGhosts => prevGhosts.map(ghost => {
        const newGhost = { ...ghost };
        const possibleMoves = ['up', 'down', 'left', 'right'].filter(dir => {
          let { x, y } = newGhost;
          if (dir === 'up') y--;
          if (dir === 'down') y++;
          if (dir === 'left') x--;
          if (dir === 'right') x++;
          return maze[y]?.[x] !== 1;
        });

        if (possibleMoves.length > 2 || !possibleMoves.includes(newGhost.direction)) {
          newGhost.direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }

        switch (newGhost.direction) {
          case 'up': newGhost.y--; break;
          case 'down': newGhost.y++; break;
          case 'left': newGhost.x--; break;
          case 'right': newGhost.x++; break;
        }
        return newGhost;
      }));

      // Check for collision with ghosts
      for (const ghost of ghosts) {
        if (ghost.x === playerPos.x && ghost.y === playerPos.y) {
          setGameOver(true);
        }
      }

    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, maze, ghosts, playerPos, gameOver]);

  return (
    <GameContainer>
      <Typography variant="h4" color="#fff">Pac-Man</Typography>
      <Typography variant="h6" color="#fff">Score: {score}</Typography>
      {gameOver && <Typography variant="h5" color="error">Game Over</Typography>}
      <GameScreen>
        {maze.map((row, y) =>
          row.map((cell, x) => {
            if (cell === 1) return <Wall key={`${y}-${x}`} style={{ gridColumn: x + 1, gridRow: y + 1 }} />;
            if (cell === 0) return <Pellet key={`${y}-${x}`} style={{ gridColumn: x + 1, gridRow: y + 1 }} />;
            return null;
          })
        )}
        <Player style={{ left: playerPos.x * 20, top: playerPos.y * 20 }} rotation={rotation} />
        {ghosts.map((ghost, i) => (
          <Ghost key={i} color={ghost.color} style={{ left: ghost.x * 20, top: ghost.y * 20 }} />
        ))}
      </GameScreen>
      <Button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>
        Restart
      </Button>
    </GameContainer>
  );
};

export default Pacman;
