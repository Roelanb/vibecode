import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import type { App } from '../types/apps';

interface AppCardProps {
  app: App;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="div"
        height="140"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'text.secondary'
        }}
      >
        {app.name.charAt(0)}
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {app.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {app.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {app.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Added: {app.dateAdded}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Played: {app.timesPlayed || app.timesUsed || 0} times
        </Typography>
        {app.minutesPlayed && (
          <Typography variant="body2" color="text.secondary">
            Minutes: {app.minutesPlayed}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" href={app.link} target="_blank" rel="noopener noreferrer">
          Open App
        </Button>
      </CardActions>
    </Card>
  );
};

export default AppCard;