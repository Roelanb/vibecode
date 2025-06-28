import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReplayIcon from '@mui/icons-material/Replay';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import KeyboardIcon from '@mui/icons-material/Keyboard';

// Types
interface Bird {
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

interface CanvasSize {
  width: number;
  height: number;
}

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 30;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500; // ms

// Styled components
const GameContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const Canvas = styled('canvas')({
  display: 'block',
  margin: '0 auto',
});

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(2),
  zIndex: 10,
}));

const FlappyBird: React.FC = () => {
  // State
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const birdRef = useRef<Bird>({ y: CANVAS_HEIGHT / 2, velocity: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const lastPipeSpawnRef = useRef<number>(0);
  const canvasSizeRef = useRef<CanvasSize>({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const endGameRef = useRef<() => void>(() => {});
  
  // Draw game elements
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvasSizeRef.current;
    const scaleX = width / CANVAS_WIDTH;
    const scaleY = height / CANVAS_HEIGHT;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw sky background
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#1976d2');
    skyGradient.addColorStop(1, '#64b5f6');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw pipes
    pipesRef.current.forEach(pipe => {
      // Top pipe
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(
        pipe.x * scaleX, 
        0, 
        PIPE_WIDTH * scaleX, 
        pipe.topHeight * scaleY
      );
      
      // Bottom pipe
      ctx.fillRect(
        pipe.x * scaleX, 
        (CANVAS_HEIGHT - pipe.bottomHeight) * scaleY, 
        PIPE_WIDTH * scaleX, 
        pipe.bottomHeight * scaleY
      );
      
      // Pipe caps
      ctx.fillStyle = '#388E3C';
      // Top pipe cap
      ctx.fillRect(
        (pipe.x - 5) * scaleX, 
        (pipe.topHeight - 20) * scaleY, 
        (PIPE_WIDTH + 10) * scaleX, 
        20 * scaleY
      );
      // Bottom pipe cap
      ctx.fillRect(
        (pipe.x - 5) * scaleX, 
        (CANVAS_HEIGHT - pipe.bottomHeight) * scaleY, 
        (PIPE_WIDTH + 10) * scaleX, 
        20 * scaleY
      );
    });
    
    // Draw ground
    ctx.fillStyle = '#795548';
    ctx.fillRect(0, (CANVAS_HEIGHT - 20) * scaleY, width, 20 * scaleY);
    
    // Draw bird
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.arc(
      (CANVAS_WIDTH / 2) * scaleX, 
      birdRef.current.y * scaleY, 
      BIRD_SIZE / 2 * scaleY, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(
      (CANVAS_WIDTH / 2 + 5) * scaleX, 
      (birdRef.current.y - 5) * scaleY, 
      5 * scaleY, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw beak
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.moveTo((CANVAS_WIDTH / 2 + 10) * scaleX, birdRef.current.y * scaleY);
    ctx.lineTo((CANVAS_WIDTH / 2 + 25) * scaleX, (birdRef.current.y - 5) * scaleY);
    ctx.lineTo((CANVAS_WIDTH / 2 + 25) * scaleX, (birdRef.current.y + 5) * scaleY);
    ctx.closePath();
    ctx.fill();
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = `${24 * scaleY}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, width / 2, 50 * scaleY);
  }, [score]);
  
  // Draw start screen
  const drawStartScreen = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvasSizeRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw sky background
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#1976d2');
    skyGradient.addColorStop(1, '#64b5f6');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw ground
    ctx.fillStyle = '#795548';
    ctx.fillRect(0, height - 20, width, 20);
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird', width / 2, height / 3);
    
    // Draw instructions
    ctx.font = '24px Arial';
    ctx.fillText('Click, tap or press Space to start', width / 2, height / 2);
    ctx.fillText('and to flap your wings', width / 2, height / 2 + 40);
  }, []);
  
  // Draw game over screen
  const drawGameOver = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvasSizeRef.current;
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw game over text
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', width / 2, height / 3);
    
    // Draw score
    ctx.font = '32px Arial';
    ctx.fillText(`Score: ${score}`, width / 2, height / 2);
    ctx.fillText(`High Score: ${Math.max(score, highScore)}`, width / 2, height / 2 + 50);
    
    // Draw restart instructions
    ctx.font = '24px Arial';
    ctx.fillText('Click, tap or press Space to restart', width / 2, height * 2/3);
  }, [score, highScore]);
  
  // End game function
  const endGame = useCallback(() => {
    setGameOver(true);
    setHighScore(prevHighScore => Math.max(prevHighScore, score));
    cancelAnimationFrame(animationFrameRef.current);
    drawGameOver();
  }, [score, drawGameOver]);
  
  // Update endGameRef when endGame function changes
  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);
  
  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameStarted || gameOver) return;
    
    // Spawn pipes
    if (timestamp - lastPipeSpawnRef.current > PIPE_SPAWN_RATE) {
      const gapPosition = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
      pipesRef.current.push({
        x: CANVAS_WIDTH,
        topHeight: gapPosition,
        bottomHeight: CANVAS_HEIGHT - gapPosition - PIPE_GAP,
        passed: false
      });
      lastPipeSpawnRef.current = timestamp;
    }
    
    // Update bird position
    birdRef.current.velocity += GRAVITY;
    birdRef.current.y += birdRef.current.velocity;
    
    // Update pipes
    pipesRef.current.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;
      
      // Check if bird passed the pipe
      if (!pipe.passed && pipe.x + PIPE_WIDTH < CANVAS_WIDTH / 2 - BIRD_SIZE / 2) {
        pipe.passed = true;
        setScore(prevScore => prevScore + 1);
      }
      
      // Check collisions
      const birdX = CANVAS_WIDTH / 2 - BIRD_SIZE / 2;
      const birdY = birdRef.current.y;
      
      // Collision with pipes
      if (
        birdX + BIRD_SIZE > pipe.x && 
        birdX < pipe.x + PIPE_WIDTH && 
        (birdY < pipe.topHeight || birdY + BIRD_SIZE > CANVAS_HEIGHT - pipe.bottomHeight)
      ) {
        endGameRef.current();
        return;
      }
    });
    
    // Remove pipes that are off-screen
    pipesRef.current = pipesRef.current.filter(pipe => pipe.x + PIPE_WIDTH > 0);
    
    // Check if bird hit the ground or ceiling
    if (birdRef.current.y + BIRD_SIZE > CANVAS_HEIGHT || birdRef.current.y < 0) {
      endGameRef.current();
      return;
    }
    
    // Draw the game
    console.log(`Bird: y=${birdRef.current.y.toFixed(2)}, v=${birdRef.current.velocity.toFixed(2)} | Pipes: ${pipesRef.current.length}`);
    drawGame();
    
    // Continue the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, drawGame]);
  
  // Initialize game
  const initGame = useCallback(() => {
    birdRef.current = { y: CANVAS_HEIGHT / 2, velocity: 0 };
    pipesRef.current = [];
    lastPipeSpawnRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    
    // Start game loop
    cancelAnimationFrame(animationFrameRef.current);
    gameLoop(0);
  }, [gameLoop]);
  
  // Handle jump
  const handleJump = useCallback(() => {
    if (!gameStarted) {
      initGame();
      return;
    }
    
    if (gameOver) {
      initGame();
      return;
    }
    
    birdRef.current.velocity = JUMP_STRENGTH;
  }, [gameStarted, gameOver, initGame]);
  
  // Handle window resize
  const handleResize = useCallback(() => {
    if (!gameContainerRef.current || !canvasRef.current) return;
    
    const containerWidth = gameContainerRef.current.clientWidth;
    const containerHeight = gameContainerRef.current.clientHeight;
    
    // Calculate the maximum size that fits in the container while maintaining aspect ratio
    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    let width = containerWidth;
    let height = width / aspectRatio;
    
    if (height > containerHeight) {
      height = containerHeight;
      width = height * aspectRatio;
    }
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    
    // Store the canvas size for scaling calculations
    canvasSizeRef.current = { width, height };
    
    // Redraw the canvas
    if (gameStarted && !gameOver) {
      drawGame();
    } else if (gameOver) {
      drawGameOver();
    } else {
      drawStartScreen();
    }
  }, [gameStarted, gameOver, drawGame, drawGameOver, drawStartScreen]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      handleJump();
    }
  }, [handleJump]);
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleKeyDown, handleResize]);
  
  // Initialize canvas on mount
  useEffect(() => {
    handleResize();
    drawStartScreen();
  }, [handleResize, drawStartScreen]);
  
  return (
    <GameContainer ref={gameContainerRef}>
      <Canvas 
        ref={canvasRef} 
        onClick={handleJump}
        onTouchStart={handleJump}
        aria-label="Flappy Bird Game Canvas"
        tabIndex={0}
      />
      
      <ControlsContainer>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={initGame}
          aria-label="Restart game"
        >
          Restart
        </Button>
        <Typography variant="body2" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TouchAppIcon /> Tap or <KeyboardIcon /> Space to jump
        </Typography>
      </ControlsContainer>
    </GameContainer>
  );
};

export default FlappyBird;
