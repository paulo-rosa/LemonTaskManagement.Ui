import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from '@mui/material';
import { UsersPageUIStore } from './users.uistore';
import './users.page.scss';

const UsersPage = observer(() => {
  const navigate = useNavigate();
  const [uiStore] = useState(() => new UsersPageUIStore());

  useEffect(() => {
    uiStore.init();
  }, [uiStore]);

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}/boards`);
  };

  if (uiStore.isLoading && uiStore.users.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box className="users-page__loading">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="users-page">
      <div className="users-page__header">
        <Typography variant="h4" className="users-page__title">
          Users
        </Typography>
        <TextField
          fullWidth
          label="Search users"
          variant="outlined"
          value={uiStore.searchTerm}
          onChange={(e) => uiStore.setSearchTerm(e.target.value)}
          className="users-page__search"
        />
      </div>

      {uiStore.error && (
        <Alert severity="error" className="users-page__error">
          {uiStore.error}
        </Alert>
      )}

      {uiStore.users.length === 0 ? (
        <Card>
          <CardContent>
            <Typography className="users-page__empty">
              No users found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="users-page__list">
          {uiStore.users.map((user) => (
            <Card key={user.id} elevation={2}>
              <CardActionArea onClick={() => user.id && handleUserClick(user.id)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.username || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  {user.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
});

export default UsersPage;
