import { Box, Typography, Container } from '@mui/material';
import TreeView from '../components/TreeView';
import data from '../data/apps.json';
import { AppCard } from '../components/AppCard';
import type { App } from '../types/apps';

const treeData = [
  {
    id: '1',
    name: 'Root 1',
    children: [
      { id: '2', name: 'Child 1' },
      { id: '3', name: 'Child 2' },
    ],
  },
  { id: '4', name: 'Root 2' },
];

const HomePage = () => {
  const vibeApps: App[] = data.apps.filter(app => app.isVibeCoded);

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
          <AppCard key={app.id} app={app} />
        ))}
      </Box>

      <TreeView data={treeData} />
    </Container>
  );
};

export default HomePage;
