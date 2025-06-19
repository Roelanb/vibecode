import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography, Container, Card, CardContent, CardMedia, CardActionArea, Chip } from '@mui/material';
import type { FC } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import appsData from './data/apps.json';
import type { App } from './types/apps';

interface DashboardProps {
  onAppSelect?: (appId: string) => void;
}

const Dashboard: FC<DashboardProps> = ({ onAppSelect }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const handleAppClick = (appId: string) => {
    if (onAppSelect) {
      onAppSelect(appId);
    } else {
      navigate(`/apps/${appId}`);
    }
  };

  // Initialize apps data
  useEffect(() => {
    const typedAppsData = appsData as unknown as { apps: App[] };
    setApps(typedAppsData.apps);
    setFilteredApps(typedAppsData.apps);
  }, []);

  // Filter and sort apps
  useEffect(() => {
    let result = [...apps];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.name.toLowerCase().includes(searchLower) || 
        (app.description && app.description.toLowerCase().includes(searchLower)) ||
        (app.tags && app.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(app => app.type === filterType);
    }

    // Apply sorting
    const sortedResult = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'popular':
        default:
          return (b.timesPlayed || 0) - (a.timesPlayed || 0);
      }
    });

    setFilteredApps(sortedResult);
  }, [apps, searchTerm, filterType, sortBy]);



  // Custom app card component
  const renderAppCard = (app: App) => (
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
      {app.isVibeCoded && (
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
      )}
      <CardActionArea onClick={() => handleAppClick(app.id)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="div"
          sx={{
            pt: '56.25%', // 16:9 aspect ratio
            backgroundColor: app.isVibeCoded ? '#1e3a8a' : '#333',
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
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filters and Search */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filter-type-label">Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value as string)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="game">Games</MenuItem>
            <MenuItem value="puzzle">Puzzles</MenuItem>
            <MenuItem value="productivity">Productivity</MenuItem>
            <MenuItem value="development">Development</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as string)}
          >
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="name">Name (A-Z)</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel htmlFor="search">Search</InputLabel>
          <OutlinedInput
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            label="Search"
          />
        </FormControl>
      </Box>
      
      {/* Apps Grid */}
      {filteredApps.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3 
        }}>
          {filteredApps.map((app) => (
            <Box key={app.id}>
              {renderAppCard(app)}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No apps found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard
