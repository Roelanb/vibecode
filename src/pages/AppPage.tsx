import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Grid, Chip, CircularProgress } from '@mui/material';
import appsData from '../data/apps.json';
import type { App } from '../types/apps';

// Lazy load the app components
const FlappyBird = React.lazy(() => import('../vibeapps/flappy-bird'));
const ClassicSnake = React.lazy(() => import('../vibeapps/classic-snake'));
const MemoryGame = React.lazy(() => import('../vibeapps/memory-game'));
const PacMan = React.lazy(() => import('../vibeapps/pac-man'));
const SpaceInvaders = React.lazy(() => import('../vibeapps/space-invaders'));

// Component mapping
const appComponents: { [key: string]: React.ComponentType } = {
  'flappy-bird': FlappyBird,
  'snake': ClassicSnake,
  'memory-match': MemoryGame,
  'pac-man': PacMan,
  'space-invaders': SpaceInvaders,
};

const AppPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const app = appsData.apps.find((a) => a.id === id) as App;

  if (!app) {
    return <Typography variant="h5">App not found</Typography>;
  }

  const AppComponent = appComponents[app.id];
  const hasComponent = !!AppComponent;

  return (
    <Box sx={{ p: 2 }}>
      {/* App Info Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'text.secondary',
                  borderRadius: 1
                }}
              >
                {app.name.charAt(0)}
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>{app.name}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{app.description}</Typography>
              
              <Box sx={{ mb: 2 }}>
                {app.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Type: {app.type}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Difficulty: {app.difficulty}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Added: {app.dateAdded}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Played: {app.timesPlayed || app.timesUsed || 0} times
                  </Typography>
                </Grid>
                {app.minutesPlayed && (
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Minutes: {app.minutesPlayed}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {app.isVibeCoded && (
                <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                  VibeCode Generated with {app.llmUsed}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* App Frame */}
      <Card>
        <CardContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {hasComponent ? (
            <Box
              sx={{
                width: '800px',
                height: '600px',
                maxWidth: '100%',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Suspense fallback={
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <CircularProgress />
                </Box>
              }>
                <AppComponent />
              </Suspense>
            </Box>
          ) : (
            <Box
              sx={{
                width: '800px',
                height: '600px',
                maxWidth: '100%',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {app.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                App implementation coming soon...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Component not found for: {app.id}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppPage;