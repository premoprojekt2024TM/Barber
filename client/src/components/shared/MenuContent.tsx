import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const mainListItems = [
  { text: 'Irányítópult', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Foglalások', icon: <AssignmentRoundedIcon />,},
  { text: 'Új időpont', icon: <AddCircleRoundedIcon />, path: '/add' },
];

const secondaryListItems = [
  { text: 'Bolt', icon: <AnalyticsRoundedIcon />, path: '/store' },
  { text: 'Csevegés', icon: <ChatIcon />, path: '/about' },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState({ section: 'main', index: 0 });

  // Find the selected item based on the current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check main items first
    const mainIndex = mainListItems.findIndex(item => item.path === currentPath);
    if (mainIndex !== -1) {
      setSelectedItem({ section: 'main', index: mainIndex });
      return;
    }
    
    // Check secondary items
    const secondaryIndex = secondaryListItems.findIndex(item => item.path === currentPath);
    if (secondaryIndex !== -1) {
      setSelectedItem({ section: 'secondary', index: secondaryIndex });
    }
  }, [location.pathname]);

  const handleItemClick = (section, index, path) => {
    setSelectedItem({ section, index });
    navigate(path);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedItem.section === 'main' && selectedItem.index === index}
              onClick={() => handleItemClick('main', index, item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedItem.section === 'secondary' && selectedItem.index === index}
              onClick={() => handleItemClick('secondary', index, item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}