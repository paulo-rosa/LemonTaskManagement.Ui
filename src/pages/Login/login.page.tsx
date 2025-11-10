import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authStore } from '../../stores';
import './login.page.scss';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/users';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    const success = await authStore.login(username, password);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Container maxWidth="sm" className="login-page">
      <Box className="login-page__content">
        <Card elevation={3}>
          <CardContent className="login-page__card">
            <Typography variant="h4" component="h1" className="login-page__title" gutterBottom>
              Lemon Task Management
            </Typography>
            <Typography variant="body2" color="text.secondary" className="login-page__subtitle">
              Sign in to continue
            </Typography>

            {authStore.error && (
              <Alert severity="error" className="login-page__error">
                {authStore.error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login-page__form">
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={authStore.loading}
                required
                autoFocus
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authStore.loading}
                required
                margin="normal"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={authStore.loading || !username || !password}
                className="login-page__submit"
              >
                {authStore.loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </form>

            <Typography variant="caption" color="text.secondary" className="login-page__hint">
              Hint: Try admin / admin123
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
});

export default LoginPage;
