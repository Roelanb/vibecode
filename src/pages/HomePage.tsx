import { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Container, Chip, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define the VibeApp type
interface VibeApp {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [vibeApps] = useState<VibeApp[]>([
    {
      id: 'snake',
      name: 'Classic Snake',
      description: 'Play the classic snake game with keyboard or touch controls. Collect food and grow your snake!',
      type: 'game',
    },
    {
      id: 'memory-match',
      name: 'Memory Match',
      description: 'Test your memory by matching pairs of cards in this classic memory game with multiple difficulty levels.',
      type: 'game',
    },
  ]);

  const handleAppClick = (appId: string) => {
    navigate(`/apps/${appId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          VibeCoded Apps
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Explore our collection of handcrafted applications built with VibeCode technology
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 4
      }}>
        {vibeApps.map((app) => (
          <Box key={app.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.4)',
                },
                overflow: 'visible',
                borderRadius: 2,
              }}
            >
              <Chip 
                label="VIBE" 
                color="primary" 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: -10, 
                  right: 16, 
                  fontWeight: 'bold',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  zIndex: 1,
                }} 
              />
              <CardActionArea onClick={() => handleAppClick(app.id)} sx={{ flexGrow: 1 }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%', // 16:9 aspect ratio
                    backgroundColor: '#1e3a8a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="h2" 
                    component="div" 
                    sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {app.name.charAt(0)}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {app.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {app.description}
                  </Typography>
                  <Chip 
                    label={app.type.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      backgroundColor: app.type === 'game' ? '#f44336' : '#4caf50',
                      color: 'white',
                    }} 
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;
