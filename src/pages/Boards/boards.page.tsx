import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from '@mui/material';
import { authStore } from '../../stores';
import { BoardsPageUIStore } from './boards.uistore';
import './boards.page.scss';

const BoardsPage = observer(() => {
  const navigate = useNavigate();
  const userId = authStore.currentUser?.userId || '';
  const [uiStore] = useState(() => new BoardsPageUIStore(userId));

  useEffect(() => {
    uiStore.init();
  }, [uiStore]);

  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  if (uiStore.isLoading && uiStore.boards.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box className="boards-page__loading">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="boards-page">
      <div className="boards-page__header">
        <Typography variant="h4" className="boards-page__title">
          My Boards
        </Typography>
      </div>

      {uiStore.error && (
        <Alert severity="error" className="boards-page__error">
          {uiStore.error}
        </Alert>
      )}

      {uiStore.boards.length === 0 ? (
        <Card>
          <CardContent>
            <Typography className="boards-page__empty">
              No boards found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="boards-page__list">
          {uiStore.boards.map((board) => (
            <Card key={board.id} elevation={2}>
              <CardActionArea onClick={() => board.id && handleBoardClick(board.id)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {board.name || 'Untitled Board'}
                  </Typography>
                  {board.description && (
                    <Typography variant="body2" color="text.secondary">
                      {board.description}
                    </Typography>
                  )}
                  {board.createdAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created: {new Date(board.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                  {board.columns && board.columns.length > 0 && (
                    <Typography variant="caption" color="primary" display="block">
                      {board.columns.length} column{board.columns.length === 1 ? '' : 's'}
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

export default BoardsPage;
