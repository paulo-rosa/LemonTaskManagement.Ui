import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { authStore } from '../stores';
import './Layout.scss';

const Layout = observer(() => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/boards');
  };

  const handleLogout = () => {
    authStore.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <AppBar position="static" className="layout__header">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="layout__title">
            Lemon Task Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {authStore.currentUser && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {authStore.currentUser.username}
            </Typography>
          )}
          <IconButton
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
});

export default Layout;
