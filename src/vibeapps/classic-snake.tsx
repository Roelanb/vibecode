import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type CellType = 'empty' | 'snake' | 'food' | 'head';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150; // ms - slower initial speed for better playability
const MIN_SPEED = 60; // Fastest speed the game will reach

const GameContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: '0 auto',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none', // Remove shadow as we're already in a Paper component
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(10px, 1fr))`,
  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(10px, 1fr))`,
  gap: '1px',
  backgroundColor: '#333',
  border: '2px solid #444',
  margin: '20px 0',
  touchAction: 'none', // Prevent scrolling on mobile when swiping
  width: '100%',
  maxWidth: '400px',
  aspectRatio: '1 / 1',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '300px',
  },
}));

const Cell = styled('div')<{ type: CellType }>(({ type, theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor:
    type === 'head' ? theme.palette.secondary.main :
    type === 'snake' ? theme.palette.primary.main :
    type === 'food' ? theme.palette.error.main :
    theme.palette.background.default,
  borderRadius: type === 'food' ? '50%' : type === 'head' ? '4px' : '2px',
}));

const ClassicSnake: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  // Using directionRef instead of direction state for immediate updates
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);
  
  // Touch controls
  const [touchStart, setTouchStart] = useState<Position | null>(null);
  
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | undefined>(undefined);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === x && segment.y === y);
    return isOnSnake ? generateFood() : { x, y };
  }, [snake]);
  
  // Initialize game
  const startGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setGameSpeed(INITIAL_SPEED);
    setGameStarted(true);
    setIsPaused(false);

    // Focus the game container for keyboard events
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [generateFood]);
  
  // Calculate game speed based on score (gets faster as score increases)
  const calculateGameSpeed = useCallback((currentScore: number): number => {
    // Start with INITIAL_SPEED and decrease (making it faster) as score increases
    // But never go below MIN_SPEED
    return Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(currentScore / 50) * 10);
  }, []);

  // Handle touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, [gameStarted, startGame]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || isPaused || !gameStarted) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Determine swipe direction based on the largest delta
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 20 && directionRef.current !== 'LEFT') {
        directionRef.current = 'RIGHT';
      } else if (deltaX < -20 && directionRef.current !== 'RIGHT') {
        directionRef.current = 'LEFT';
      }
    } else {
      // Vertical swipe
      if (deltaY > 20 && directionRef.current !== 'UP') {
        directionRef.current = 'DOWN';
      } else if (deltaY < -20 && directionRef.current !== 'DOWN') {
        directionRef.current = 'UP';
      }
    }
    
    // Reset touch start position after a significant movement
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, [touchStart, isPaused, gameStarted]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);



  // Auto-start game when component mounts
  useEffect(() => {
    // Don't auto-start, wait for user input
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Handle keyboard controls
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent default behavior for arrow keys and space to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }
    
    if (!gameStarted && !gameOver) {
      startGame();
      return;
    }

    if (isPaused && e.key !== ' ') return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
        break;
      case ' ':
        togglePause();
        break;
      default:
        break;
    }
  }, [gameStarted, gameOver, isPaused, startGame]);

  // Game over handler
  const gameOverHandler = useCallback(() => {
    setGameOver(true);
    setGameStarted(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        // Move head
        switch (dir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check for collisions with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          gameOverHandler();
          return prevSnake;
        }

        // Check for collisions with self (excluding the tail which will move)
        if (prevSnake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y)) {
          gameOverHandler();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
          const newScore = score + 10;
          setScore(newScore);
          
          // Adjust game speed based on new score
          const newSpeed = calculateGameSpeed(newScore);
          setGameSpeed(newSpeed);
          
          return newSnake; // Don't remove tail
        }

        // Remove tail if no food eaten
        newSnake.pop();
        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, gameSpeed);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [food, gameOver, gameStarted, generateFood, isPaused, gameOverHandler, score, gameSpeed, calculateGameSpeed]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };


  // Render game grid
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = !isHead && snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const cellType = isHead ? 'head' : isSnakeBody ? 'snake' : isFood ? 'food' : 'empty';
        
        grid.push(
          <Cell 
            key={`${x}-${y}`} 
            type={cellType} 
            data-testid={`cell-${x}-${y}`}
          />
        );
      }
    }
    return grid;
  };

  // Touch controls for mobile
  const renderMobileControls = () => {
    return (
      <Box 
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          width: '100%'
        }}
      >
        <IconButton 
          color="primary" 
          aria-label="Move Up"
          onClick={() => directionRef.current !== 'DOWN' && (directionRef.current = 'UP')}
          sx={{ mb: 1 }}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <IconButton 
            color="primary" 
            aria-label="Move Left"
            onClick={() => directionRef.current !== 'RIGHT' && (directionRef.current = 'LEFT')}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            aria-label="Move Right"
            onClick={() => directionRef.current !== 'LEFT' && (directionRef.current = 'RIGHT')}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <IconButton 
          color="primary" 
          aria-label="Move Down"
          onClick={() => directionRef.current !== 'UP' && (directionRef.current = 'DOWN')}
          sx={{ mt: 1 }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <GameContainer 
      elevation={3}
      ref={gameContainerRef}
      tabIndex={0}
      sx={{ outline: 'none' }}
      onKeyDown={handleKeyDown}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">Classic Snake</Typography>
        <Typography variant="h6">Score: {score}</Typography>
      </Box>
      
      {!gameStarted && (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          minHeight="300px"
        >
          {gameOver ? (
            <Typography variant="h6" color="error" gutterBottom>
              Game Over! Final Score: {score}
            </Typography>
          ) : (
            <Typography variant="h6" gutterBottom>
              Use arrow keys or WASD to play
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={startGame}
            size="large"
            startIcon={<PlayArrowIcon />}
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </Button>
        </Box>
      )}

      {gameStarted && (
        <>
          <Grid
            ref={gridRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderGrid()}
          </Grid>
          
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={togglePause}
              startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={startGame}
              startIcon={<ReplayIcon />}
            >
              Restart
            </Button>
          </Box>
          
          {/* Mobile directional controls */}
          {renderMobileControls()}
          
          {/* Game status message */}
          {isPaused && (
            <Typography 
              variant="h5" 
              color="secondary" 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: 2,
                borderRadius: 1,
              }}
            >
              PAUSED
            </Typography>
          )}
        </>
      )}
    </GameContainer>
  );
};

export default ClassicSnake;
