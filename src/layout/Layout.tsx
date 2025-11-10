import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import './Layout.scss';

const Layout = observer(() => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/users');
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
        </Toolbar>
      </AppBar>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
});

export default Layout;
