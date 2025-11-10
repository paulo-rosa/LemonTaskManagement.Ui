import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BoardDetailPageUIStore } from './board-detail.uistore';
import './board-detail.page.scss';

const BoardDetailPage = observer(() => {
  const navigate = useNavigate();
  const { userId, boardId } = useParams<{ userId: string; boardId: string }>();
  const [uiStore] = useState(
    () => new BoardDetailPageUIStore(userId || '', boardId || '')
  );

  useEffect(() => {
    uiStore.init();
  }, [uiStore]);

  const handleBackClick = () => {
    navigate(`/users/${userId}/boards`);
  };

  if (uiStore.isLoading && !uiStore.board) {
    return (
      <Container maxWidth="lg">
        <Box className="board-detail-page__loading">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="board-detail-page">
      <div className="board-detail-page__header">
        <IconButton
          onClick={handleBackClick}
          className="board-detail-page__back-button"
          aria-label="back to boards"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="board-detail-page__title">
          {uiStore.board?.name || 'Board Details'}
        </Typography>
      </div>

      {uiStore.error && (
        <Alert severity="error" className="board-detail-page__error">
          {uiStore.error}
        </Alert>
      )}

      {uiStore.board ? (
        <div className="board-detail-page__content">
          <Card className="board-detail-page__info">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Board Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {uiStore.board.name || 'N/A'}
              </Typography>
              {uiStore.board.description && (
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> {uiStore.board.description}
                </Typography>
              )}
              {uiStore.board.createdAt && (
                <Typography variant="body1" gutterBottom>
                  <strong>Created:</strong>{' '}
                  {new Date(uiStore.board.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Columns
          </Typography>

          <div className="board-detail-page__columns">
            {uiStore.board.columns && uiStore.board.columns.length > 0 ? (
              uiStore.board.columns.map((column) => (
                <Card key={column.id} className="board-detail-page__column">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {column.name || 'Untitled Column'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Order: {column.order ?? 'N/A'}
                    </Typography>
                    {column.cards && column.cards.length > 0 && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        {column.cards.length} card{column.cards.length === 1 ? '' : 's'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="board-detail-page__placeholder">
                <CardContent>
                  <Typography color="text.secondary">
                    No columns found for this board.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip label="To Do" sx={{ m: 0.5 }} />
                    <Chip label="In Progress" sx={{ m: 0.5 }} color="primary" />
                    <Chip label="Done" sx={{ m: 0.5 }} color="success" />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      (Sample columns for demonstration)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent>
            <Typography className="board-detail-page__placeholder">
              Board not found
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
});

export default BoardDetailPage;
