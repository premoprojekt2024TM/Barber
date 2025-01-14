import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import SearchIcon from '@mui/icons-material/Search';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { NavLink, useLocation } from 'react-router-dom'; 

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/auth/dash' },
  { text: 'Analytics', icon: <AnalyticsRoundedIcon />, path: '/analytics' },
  { text: 'Clients', icon: <PeopleRoundedIcon />, path: '/clients' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, path: '/tasks' },
  { text: 'Finder', icon: <SearchIcon />, path: '/auth/finder' },
  { text: 'Add Store', icon: <AddBusinessIcon />, path: '/auth/store' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback' },
];

export default function MenuContent() {
  const location = useLocation(); 
  const [selectedIndex, setSelectedIndex] = React.useState(() => {
    const storedIndex = localStorage.getItem('selectedIndex');
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });

  React.useEffect(() => {
    localStorage.setItem('selectedIndex', selectedIndex);
  }, [selectedIndex]);

  React.useEffect(() => {
    const path = location.pathname;

    const findSelectedIndex = (items) => {
      return items.findIndex(item => item.path === path);
    };

    const mainIndex = findSelectedIndex(mainListItems);
    const secondaryIndex = findSelectedIndex(secondaryListItems);

    if (mainIndex !== -1) {
      setSelectedIndex(mainIndex);
    } else if (secondaryIndex !== -1) {
      setSelectedIndex(mainListItems.length + secondaryIndex);
    }
  }, [location.pathname]);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <NavLink
              to={item.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <NavLink
              to={item.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ListItemButton
                selected={selectedIndex === index + mainListItems.length}
                onClick={() => handleListItemClick(index + mainListItems.length)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
