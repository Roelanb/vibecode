import React from 'react';
import { Grid } from '@mui/material';
import AppCard from '../components/AppCard';
import appsData from '../data/apps.json';
import type { App } from '../types/apps';

const HomePage: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {appsData.apps.map((app) => (
        <Grid item key={app.id} xs={12} sm={6} md={4} lg={3}>
          <AppCard app={app as App} />
        </Grid>
      ))}
    </Grid>
  );
};

export default HomePage;