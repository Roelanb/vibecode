import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { lazy, Suspense } from 'react';

// Lazy load the apps to improve initial load performance
const SnakeGame = lazy(() => import('../vibeapps/classic-snake'));
const MemoryGame = lazy(() => import('../vibeapps/memory-game'));

const AppPage = () => {
  const { appId } = useParams<{ appId: string }>();
  
  const renderApp = () => {
    // Wrapper for vibeapps to ensure they take 50% width
    const AppWrapper = ({ children }: { children: React.ReactNode }) => (
      <Box 
        sx={{ 
          width: { xs: '100%', sm: '80%', md: '50%' },
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            width: '100%', 
            height: '100%',
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            position: 'relative',
          }}
        >
          {children}
        </Paper>
      </Box>
    );
    
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
            <AppWrapper>
              <SnakeGame />
            </AppWrapper>
          </Suspense>
        );
      case 'memory-match':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AppWrapper>
              <MemoryGame />
            </AppWrapper>
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
