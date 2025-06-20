import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, Button, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReplayIcon from '@mui/icons-material/Replay';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';

// Types
type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameStats = {
  moves: number;
  matches: number;
  startTime: number | null;
  endTime: number | null;
};

type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Constants
const DIFFICULTY_LEVELS = {
  easy: { pairs: 6, columns: 4 },
  medium: { pairs: 8, columns: 4 },
  hard: { pairs: 12, columns: 6 }
};

// Helper to calculate card size based on screen dimensions and difficulty
const useCardSize = (difficulty: DifficultyLevel) => {
  const [cardSize, setCardSize] = React.useState<number>(0);
  
  React.useEffect(() => {
    const calculateCardSize = () => {
      // Get available space (accounting for header, controls, and margins)
      const availableHeight = window.innerHeight - 180; // Subtract header, controls, margins
      const availableWidth = window.innerWidth - 32; // Subtract side margins
      
      // Calculate rows needed based on pairs and columns
      const totalCards = DIFFICULTY_LEVELS[difficulty].pairs * 2;
      const columns = DIFFICULTY_LEVELS[difficulty].columns;
      const rows = Math.ceil(totalCards / columns);
      
      // Calculate maximum card size that will fit in the available space
      const maxCardWidth = availableWidth / columns - 16; // Subtract gap between cards
      const maxCardHeight = availableHeight / rows - 16; // Subtract gap between cards
      
      // Use the smaller dimension to maintain square aspect ratio
      const size = Math.min(maxCardWidth, maxCardHeight);
      
      setCardSize(size);
    };
    
    calculateCardSize();
    window.addEventListener('resize', calculateCardSize);
    
    return () => window.removeEventListener('resize', calculateCardSize);
  }, [difficulty]);
  
  return cardSize;
};

// Styled components
const GameContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: '0',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  boxShadow: 'none', // Remove shadow as we're already in a Paper component
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
}));

const CardContainer = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
}));

const CardFace = styled(Paper)<{ isfront: string }>(({ theme, isfront }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isfront === 'true' ? theme.palette.primary.light : theme.palette.background.default,
  border: `2px solid ${isfront === 'true' ? theme.palette.primary.main : theme.palette.divider}`,
  transform: isfront === 'true' ? 'rotateY(180deg)' : 'rotateY(0deg)',
  fontSize: '2.5rem', // Adjusted font size for better fit
}));

const MemoryGame: React.FC = () => {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    startTime: null,
    endTime: null,
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  // Calculate optimal card size based on screen dimensions and difficulty
  const cardSize = useCardSize(difficulty);

  // Emojis for cards - using useMemo to prevent unnecessary re-creation
  const emojis = useMemo(() => [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦄', '🦋', '🐢', '🐙', '🦀', '🐠', '🦖', '🦕'
  ], []);

  // Initialize game
  const initializeGame = useCallback(() => {
    const { pairs } = DIFFICULTY_LEVELS[difficulty];
    const gameEmojis = emojis.slice(0, pairs);
    
    // Create pairs of cards with emojis
    const newCards = [...gameEmojis, ...gameEmojis]
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle cards
    
    setCards(newCards);
    setFlippedCards([]);
    setGameStats({
      moves: 0,
      matches: 0,
      startTime: null,
      endTime: null,
    });
    setIsGameOver(false);
    setIsGameStarted(false);
  }, [difficulty, emojis]);

  // Start game
  const startGame = useCallback(() => {
    setGameStats(prev => ({
      ...prev,
      startTime: Date.now(),
      endTime: null,
    }));
    setIsGameStarted(true);
  }, []);

  // Handle card click
  const handleCardClick = useCallback((id: number) => {
    // Don't allow clicks if game is over or card is already flipped or matched
    if (
      isGameOver || 
      flippedCards.length >= 2 || 
      flippedCards.includes(id) || 
      cards.find(card => card.id === id)?.isMatched
    ) {
      return;
    }

    // Start game on first card click
    if (!isGameStarted) {
      startGame();
    }

    // Flip the card
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Update cards state
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      // Increment moves
      setGameStats(prev => ({
        ...prev,
        moves: prev.moves + 1,
      }));

      // Check if cards match
      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setCards(prevCards => 
          prevCards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        
        setGameStats(prev => ({
          ...prev,
          matches: prev.matches + 1,
        }));
        
        setFlippedCards([]);
        
        // Check if game is over
        if (gameStats.matches + 1 === DIFFICULTY_LEVELS[difficulty].pairs) {
          setIsGameOver(true);
          setGameStats(prev => ({
            ...prev,
            endTime: Date.now(),
          }));
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              newFlippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [cards, flippedCards, gameStats, isGameOver, isGameStarted, difficulty, startGame]);

  // Change difficulty
  const changeDifficulty = useCallback((newDifficulty: keyof typeof DIFFICULTY_LEVELS) => {
    setDifficulty(newDifficulty);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Format time
  const formatTime = useCallback((milliseconds: number | null) => {
    if (!milliseconds) return '00:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Calculate elapsed time
  const getElapsedTime = useCallback(() => {
    if (!gameStats.startTime) return 0;
    const endTime = gameStats.endTime || Date.now();
    return endTime - gameStats.startTime;
  }, [gameStats.startTime, gameStats.endTime]);

  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  // Update timer
  const [timer, setTimer] = useState('00:00');
  useEffect(() => {
    if (!isGameStarted || isGameOver) return;
    
    const interval = setInterval(() => {
      setTimer(formatTime(getElapsedTime()));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, getElapsedTime, formatTime]);

  // Render card
  const renderCard = (card: Card) => {
    return (
      <Box 
        sx={{
          width: `${cardSize}px`,
          height: `${cardSize}px`,
          position: 'relative',
        }}
      >
        <CardContainer
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
            opacity: card.isMatched ? 0.8 : 1, // Slightly less transparent for matched cards
          }}
          onClick={() => !card.isMatched && handleCardClick(card.id)} // Prevent clicking on matched cards
          tabIndex={card.isMatched ? -1 : 0} // Remove from tab order if matched
          aria-label={`Memory card ${card.id} ${card.isMatched ? 'matched' : ''}`}
          onKeyDown={(e) => {
            if (!card.isMatched && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleCardClick(card.id);
            }
          }}
        >
          <CardFace isfront="false">
            <Typography variant="h4" color="textSecondary">?</Typography>
          </CardFace>
          <CardFace isfront="true">
            <Typography variant="h3" color={card.isMatched ? 'success.main' : 'inherit'}>{card.emoji}</Typography>
          </CardFace>
        </CardContainer>
      </Box>
    );
  };

  return (
    <GameContainer elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box width="100%" mb={2}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Memory Game
        </Typography>
        
        {/* Game stats */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          <Chip 
            icon={<TimerIcon />} 
            label={timer} 
            color="primary" 
            variant="outlined"
          />
          
          <Chip 
            icon={<EmojiEventsIcon />} 
            label={`Matches: ${gameStats.matches}/${DIFFICULTY_LEVELS[difficulty].pairs}`} 
            color="secondary" 
            variant="outlined"
          />
          
          <Chip 
            label={`Moves: ${gameStats.moves}`} 
            color="default" 
            variant="outlined"
          />
        </Box>
        
        {/* Difficulty buttons */}
        <Box 
          display="flex" 
          justifyContent="center" 
          gap={1}
          mb={2}
          flexWrap="wrap"
        >
          <Button 
            variant={difficulty === 'easy' ? 'contained' : 'outlined'} 
            color="primary" 
            size="small"
            onClick={() => changeDifficulty('easy')}
            disabled={isGameStarted && !isGameOver}
          >
            Easy
          </Button>
          <Button 
            variant={difficulty === 'medium' ? 'contained' : 'outlined'} 
            color="primary" 
            size="small"
            onClick={() => changeDifficulty('medium')}
            disabled={isGameStarted && !isGameOver}
          >
            Medium
          </Button>
          <Button 
            variant={difficulty === 'hard' ? 'contained' : 'outlined'} 
            color="primary" 
            size="small"
            onClick={() => changeDifficulty('hard')}
            disabled={isGameStarted && !isGameOver}
          >
            Hard
          </Button>
          
          <IconButton 
            color="primary" 
            onClick={resetGame}
            aria-label="Reset game"
          >
            <ReplayIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Game board */}
      <Box width="100%" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${DIFFICULTY_LEVELS[difficulty].columns}, 1fr)`,
          gap: { xs: 1, sm: 2 },
          maxWidth: '100%',
          width: 'fit-content',
        }}>
          {cards.map((card) => (
            <Box key={card.id}>
              {renderCard(card)}
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Game over message */}
      {isGameOver && (
        <Box 
          mt={3} 
          p={2} 
          bgcolor="success.light" 
          borderRadius={1} 
          textAlign="center"
          width="100%"
        >
          <Typography variant="h5" gutterBottom>
            Congratulations! 🎉
          </Typography>
          <Typography variant="body1">
            You completed the game in {formatTime(getElapsedTime())} with {gameStats.moves} moves!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetGame}
            startIcon={<ReplayIcon />}
            sx={{ mt: 2 }}
          >
            Play Again
          </Button>
        </Box>
      )}
    </GameContainer>
  );
};

export default MemoryGame;
