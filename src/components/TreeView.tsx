import React from 'react';
import { List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import appsData from '../data/apps.json';

const TreeView: React.FC = () => {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="All Apps" />
        </ListItemButton>
      </ListItem>
      <Divider />
      {appsData.apps.map((app) => (
        <ListItem key={app.id} disablePadding>
          <ListItemButton component={Link} to={`/app/${app.id}`}>
            <ListItemText primary={app.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default TreeView;