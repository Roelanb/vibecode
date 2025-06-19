import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAppPage = location.pathname.startsWith('/apps/');
  const appId = isAppPage ? location.pathname.split('/').pop() : '';
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {isAppPage ? (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="back to dashboard"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="home"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isAppPage ? `VibeCode - ${appId?.charAt(0).toUpperCase()}${appId?.slice(1)}` : 'VibeCode Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Container maxWidth={false} disableGutters={isAppPage} sx={{ height: '100%' }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
