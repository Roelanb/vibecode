import { Card, CardContent, CardMedia, Typography, Chip, Box, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { App } from '../types/apps';

interface AppCardProps {
  app: App
  onClick?: (id: string) => void
}

export const AppCard = ({ app, onClick }: AppCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'game':
        return 'primary'
      case 'puzzle':
        return 'secondary'
      case 'productivity':
        return 'success'
      case 'development':
        return 'info'
      case 'tools':
        return 'warning'
      default:
        return 'default'
    }
  }

  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(app.id);
    } else {
      navigate(`/apps/${app.id}`);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          cursor: 'pointer',
        },
      }}
      onClick={handleClick}
    >
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="div"
          sx={{
            pt: '56.25%', // 16:9 aspect ratio
            position: 'relative',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            fontSize: '3rem',
          }}
        >
          {app.name.charAt(0).toUpperCase()}
        </CardMedia>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" noWrap sx={{ fontWeight: 'bold' }}>
              {app.name}
            </Typography>
            <Chip
              label={app.type}
              color={getTypeColor(app.type)}
              size="small"
              sx={{ textTransform: 'capitalize', ml: 1 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            minHeight: '4.5em',
          }}>
            {app.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {app.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
        <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="caption" color="text.secondary">
            {app.timesPlayed} plays
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round(app.minutesPlayed / 60)}h played
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default AppCard
