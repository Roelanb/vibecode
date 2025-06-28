import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';

// Lazy load the apps to improve initial load performance
const SnakeGame = lazy(() => import('../vibeapps/classic-snake'));
const MemoryGame = lazy(() => import('../vibeapps/memory-game'));
const FlappyBird = lazy(() => import('../vibeapps/flappy-bird'));
const SpaceInvaders = lazy(() => import('../vibeapps/space-invaders'));
const Pacman = lazy(() => import('../vibeapps/pac-man'));

const AppPage = () => {
  const { appId } = useParams<{ appId: string }>();
  
  const renderApp = () => {
    
    // Loading component with spinner
    const LoadingFallback = () => (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          width: '100%',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading app...
        </Typography>
      </Box>
    );

    switch (appId) {
      case 'snake':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Box 
              sx={{ 
                width: '100vw',
                height: 'calc(100vh - 64px)', // Subtract the AppBar height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
                m: 0,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                }}
              >
                <SnakeGame />
              </Box>
            </Box>
          </Suspense>
        );
      case 'memory-match':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Box 
              sx={{ 
                width: '100vw',
                height: 'calc(100vh - 64px)', // Subtract the AppBar height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
                m: 0,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                }}
              >
                <MemoryGame />
              </Box>
            </Box>
          </Suspense>
        );
      case 'flappy-bird':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Box 
              sx={{ 
                width: '100vw',
                height: 'calc(100vh - 64px)', // Subtract the AppBar height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
                m: 0,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                }}
              >
                <FlappyBird />
              </Box>
            </Box>
          </Suspense>
        );
      case 'space-invaders':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Box 
              sx={{ 
                width: '100vw',
                height: 'calc(100vh - 64px)', // Subtract the AppBar height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
                m: 0,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                }}
              >
                <SpaceInvaders />
              </Box>
            </Box>
          </Suspense>
        );
      case 'pac-man':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Box 
              sx={{ 
                width: '100vw',
                height: 'calc(100vh - 64px)', // Subtract the AppBar height
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
                m: 0,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                }}
              >
                <Pacman />
              </Box>
            </Box>
          </Suspense>
        );

      // Add more cases for other apps here
      default:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {appId ? `${appId.charAt(0).toUpperCase() + appId.slice(1)}` : 'App Not Found'}
            </Typography>
            <Typography variant="body1">
              {appId ? `The ${appId} app is coming soon!` : 'Please select an app from the dashboard.'}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {renderApp()}
    </Box>
  );
};

export default AppPage;
