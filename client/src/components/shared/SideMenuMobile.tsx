import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import { isWorkerAuthenticated, getInfoFromToken } from "../../utils/axiosInstance";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const [workerInfo, setWorkerInfo] = useState({
    username: "",
    email: "",
    profilePic: ""
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isWorkerAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userInfo = getInfoFromToken();
        if (userInfo) {
          setWorkerInfo({
            username: userInfo.username || "Worker",
            email: userInfo.email || "worker@example.com",
            profilePic: userInfo.profilePic || "/static/images/avatar/default.jpg"
          });
        }
      }
    };
    
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={workerInfo.username}
              src={workerInfo.profilePic}
              sx={{ width: 36, height: 36 }}
            />
            <Typography component="p" variant="h6">
              {workerInfo.username}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
            Kijelentkezés
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}