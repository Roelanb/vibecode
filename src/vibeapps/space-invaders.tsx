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
  width: '100%',
  maxWidth: '800px',
  height: '600px',
  backgroundColor: '#000',
  border: '2px solid #333',
  overflow: 'hidden',
});

const Player = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  width: '40px',
  height: '24px',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    top: '0',
    left: '18px',
    background: 'transparent',
    boxShadow:
      '0 0 0 4px #39ff14, ' +
      '-4px 4px 0 4px #39ff14, 4px 4px 0 4px #39ff14, ' +
      '-8px 8px 0 4px #39ff14, 8px 8px 0 4px #39ff14, ' +
      '-16px 12px 0 4px #39ff14, -12px 12px 0 4px #39ff14, -8px 12px 0 4px #39ff14, -4px 12px 0 4px #39ff14, 0 12px 0 4px #39ff14, 4px 12px 0 4px #39ff14, 8px 12px 0 4px #39ff14, 12px 12px 0 4px #39ff14, 16px 12px 0 4px #39ff14',
  },
});

const Bullet = styled(Box)({
  position: 'absolute',
  width: '4px',
  height: '12px',
  backgroundColor: '#ff4d4d',
  boxShadow: '0 0 6px #ff4d4d, 0 0 10px #ff4d4d, 0 0 15px #fff',
});

const Bunker = styled(Box)({
  position: 'absolute',
  width: '80px',
  height: '60px',
  backgroundColor: '#39ff14',
  clipPath: 'polygon(0% 100%, 0% 30%, 20% 30%, 20% 0%, 80% 0%, 80% 30%, 100% 30%, 100% 100%, 70% 100%, 70% 70%, 30% 70%, 30% 100%)',
});

// Pixel-art style aliens using box-shadow
const AlienType1 = styled(Box)({
  position: 'absolute',
  width: '32px',
  height: '24px',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'transparent',
    boxShadow:
      '8px 0 0 4px #ff00ff, 12px 0 0 4px #ff00ff, ' +
      '4px 4px 0 4px #ff00ff, 8px 4px 0 4px #ff00ff, 12px 4px 0 4px #ff00ff, 16px 4px 0 4px #ff00ff, ' +
      '0px 8px 0 4px #ff00ff, 4px 8px 0 4px #ff00ff, 8px 8px 0 4px #ff00ff, 12px 8px 0 4px #ff00ff, 16px 8px 0 4px #ff00ff, 20px 8px 0 4px #ff00ff, ' +
      '0px 12px 0 4px #ff00ff, 4px 12px 0 4px #ff00ff, 16px 12px 0 4px #ff00ff, 20px 12px 0 4px #ff00ff, ' +
      '4px 16px 0 4px #ff00ff, 8px 16px 0 4px #ff00ff, 12px 16px 0 4px #ff00ff, 16px 16px 0 4px #ff00ff',
  },
});

const AlienType2 = styled(Box)({
  position: 'absolute',
  width: '32px',
  height: '24px',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'transparent',
    boxShadow:
      '4px 0px 0 4px #00ffff, 16px 0px 0 4px #00ffff, ' +
      '8px 4px 0 4px #00ffff, 12px 4px 0 4px #00ffff, ' +
      '4px 8px 0 4px #00ffff, 8px 8px 0 4px #00ffff, 12px 8px 0 4px #00ffff, 16px 8px 0 4px #00ffff, ' +
      '0px 12px 0 4px #00ffff, 4px 12px 0 4px #00ffff, 8px 12px 0 4px #00ffff, 12px 12px 0 4px #00ffff, 16px 12px 0 4px #00ffff, 20px 12px 0 4px #00ffff, ' +
      '0px 16px 0 4px #00ffff, 20px 16px 0 4px #00ffff, ' +
      '4px 20px 0 4px #00ffff, 16px 20px 0 4px #00ffff',
  },
});

const AlienType3 = styled(Box)({
  position: 'absolute',
  width: '32px',
  height: '24px',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'transparent',
    boxShadow:
      '8px 0px 0 4px #ffff00, ' +
      '4px 4px 0 4px #ffff00, 12px 4px 0 4px #ffff00, ' +
      '0px 8px 0 4px #ffff00, 4px 8px 0 4px #ffff00, 8px 8px 0 4px #ffff00, 12px 8px 0 4px #ffff00, 16px 8px 0 4px #ffff00, ' +
      '0px 12px 0 4px #ffff00, 16px 12px 0 4px #ffff00, ' +
      '0px 16px 0 4px #ffff00, 4px 16px 0 4px #ffff00, 8px 16px 0 4px #ffff00, 12px 16px 0 4px #ffff00, 16px 16px 0 4px #ffff00, ' +
      '4px 20px 0 4px #ffff00, 12px 20px 0 4px #ffff00',
  },
});

const SpaceInvaders: React.FC = () => {
  const [playerX, setPlayerX] = useState(380);
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [invaders, setInvaders] = useState<{ x: number; y: number; direction: 'left' | 'right'; type: 1 | 2 | 3 }[]>([]);
  const [bunkers, setBunkers] = useState<{ x: number; y: number; hits: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

const movePlayer = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPlayerX((x) => Math.max(x - 20, 0));
    } else if (e.key === 'ArrowRight') {
      setPlayerX((x) => Math.min(x + 20, 760));
    } else if (e.key === ' ') {
      // Shoot bullet
      setBullets((b) => [...b, { x: playerX + 18, y: 520 }]);
    }
  }, [playerX]);

  useEffect(() => {
    // Initial setup for invaders with different types
    const initialInvaders = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        let type: 1 | 2 | 3 = 1;
        if (i === 0) type = 3; // Top row - most valuable
        else if (i <= 2) type = 2; // Middle rows
        else type = 1; // Bottom rows - least valuable
        
        initialInvaders.push({ 
          x: j * 60 + 40, 
          y: i * 40 + 40, 
          direction: 'right' as 'right',
          type
        });
      }
    }
    setInvaders(initialInvaders);
    
    // Initialize bunkers
    const initialBunkers = [];
    for (let i = 0; i < 4; i++) {
      initialBunkers.push({ 
        x: i * 160 + 120, 
        y: 450, 
        hits: 0 
      });
    }
    setBunkers(initialBunkers);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', movePlayer);
    return () => document.removeEventListener('keydown', movePlayer);
  }, [movePlayer]);

 // Game loop
  useEffect(() => {
    if (gameOver) return;

    // Game timing constants
    const dropAmount = 5;  // How far down the invaders move each time
    const horizontalMoveAmount = 10; // How far sideways the invaders move

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets((prevBullets) =>
        prevBullets
          .map((b) => ({ ...b, y: b.y - 8 })) // Faster bullets
          .filter((b) => b.y > 0)
      );

      // Move invaders
      setInvaders((prevInvaders) => {
        const newInvaders = [...prevInvaders];
        let edgeReached = false;

        // Check if any invader has reached an edge
        for (const invader of newInvaders) {
          if (invader.direction === 'right' && invader.x > 570) {
            edgeReached = true;
            break;
          } else if (invader.direction === 'left' && invader.x < 0) {
            edgeReached = true;
            break;
          }
        }

        // Update invader direction and position
        for (const invader of newInvaders) {
          if (edgeReached) {
            invader.direction = invader.direction === 'right' ? 'left' as 'left' : 'right' as 'right';
            invader.y += dropAmount;
          } else {
            invader.x += invader.direction === 'right' ? horizontalMoveAmount : -horizontalMoveAmount;
          }
        }

        return newInvaders;
      });


      // Collision detection
      setBullets((prevBullets) => {
        const remainingBullets = [];
        const newInvaders = [...invaders];

        for (const bullet of prevBullets) {
          let hit = false;
          
          // Check invader collisions
          for (let i = newInvaders.length - 1; i >= 0; i--) {
            const invader = newInvaders[i];
            if (
              bullet.x > invader.x &&
              bullet.x < invader.x + 32 &&
              bullet.y > invader.y &&
              bullet.y < invader.y + 24
            ) {
              hit = true;
              const points = invader.type === 3 ? 30 : invader.type === 2 ? 20 : 10;
              newInvaders.splice(i, 1);
              setScore((s) => s + points);
              break;
            }
          }
          
          // Check bunker collisions
          if (!hit) {
            setBunkers((prevBunkers) => {
              const newBunkers = [...prevBunkers];
              for (let i = 0; i < newBunkers.length; i++) {
                const bunker = newBunkers[i];
                if (
                  bullet.x > bunker.x &&
                  bullet.x < bunker.x + 80 &&
                  bullet.y > bunker.y &&
                  bullet.y < bunker.y + 60 &&
                  bunker.hits < 3
                ) {
                  hit = true;
                  newBunkers[i].hits++;
                  break;
                }
              }
              return newBunkers;
            });
          }
          
          if (!hit) {
            remainingBullets.push(bullet);
          }
        }
        setInvaders(newInvaders);
        return remainingBullets;
      });

      // Check for game over
      if (invaders.some((invader) => invader.y > 360)) {
        setGameOver(true);
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [bullets, invaders, gameOver]);

  return (
    <GameContainer>
      <Typography variant="h4">Space Invaders</Typography>
      <Typography variant="h6">Score: {score}</Typography>
      {gameOver && <Typography variant="h5" color="error">Game Over</Typography>}
      <GameScreen>
        <Player style={{ left: `${playerX}px` }} />
        {bullets.map((b, i) => (
          <Bullet key={i} style={{ left: `${b.x}px`, top: `${b.y}px` }} />
        ))}
        {invaders.map((inv, i) => {
          const AlienComponent = inv.type === 3 ? AlienType3 : inv.type === 2 ? AlienType2 : AlienType1;
          return (
            <AlienComponent key={i} style={{ left: `${inv.x}px`, top: `${inv.y}px` }} />
          );
        })}
        {bunkers.map((bunker, i) => (
          <Bunker 
            key={i} 
            style={{ 
              left: `${bunker.x}px`, 
              top: `${bunker.y}px`,
              opacity: bunker.hits >= 3 ? 0 : 1 - (bunker.hits * 0.3)
            }} 
          />
        ))}
      </GameScreen>
      <Button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>
        Restart
      </Button>
    </GameContainer>
  );
};

export default SpaceInvaders;

