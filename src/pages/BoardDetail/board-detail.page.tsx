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
  Fab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { authStore } from '../../stores';
import { BoardDetailPageUIStore } from './board-detail.uistore';
import { AddCardDialog } from '../../components/AddCardDialog';
import { EditCardDialog } from '../../components/EditCardDialog';
import type { CardDto } from '../../api/LemonTaskManagementApiClient';
import './board-detail.page.scss';

const BoardDetailPage = observer(() => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const userId = authStore.currentUser?.userId || '';
  const [uiStore] = useState(
    () => new BoardDetailPageUIStore(userId, boardId || '')
  );
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  const [editCardDialogOpen, setEditCardDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);
  const [draggedCard, setDraggedCard] = useState<CardDto | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(null);

  useEffect(() => {
    uiStore.init();
  }, [uiStore]);

  const handleBackClick = () => {
    navigate('/boards');
  };

  const handleAddCardClick = (columnId: string) => {
    setSelectedColumnId(columnId);
    setAddCardDialogOpen(true);
  };

  const handleAddCardSubmit = async (description: string) => {
    if (selectedColumnId) {
      const success = await uiStore.createCard(selectedColumnId, description);
      if (success) {
        setAddCardDialogOpen(false);
        setSelectedColumnId(null);
      }
    }
  };

  const handleAddCardClose = () => {
    setAddCardDialogOpen(false);
    setSelectedColumnId(null);
  };

  const handleEditCardClick = (card: CardDto) => {
    setSelectedCard(card);
    setEditCardDialogOpen(true);
  };

  const handleEditCardSubmit = async (cardId: string, description: string) => {
    const success = await uiStore.updateCard(cardId, description, selectedCard?.assignedUserId);
    if (success) {
      setEditCardDialogOpen(false);
      setSelectedCard(null);
    }
  };

  const handleEditCardClose = () => {
    setEditCardDialogOpen(false);
    setSelectedCard(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, card: CardDto) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to allow the drag image to be set
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedCard(null);
    setDraggedOverColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnterColumn = (columnId: string) => {
    setDraggedOverColumnId(columnId);
  };

  const handleDragLeaveColumn = () => {
    setDraggedOverColumnId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string, dropIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedCard || !draggedCard.id) {
      return;
    }

    const targetColumn = uiStore.board?.columns?.find((col) => col.id === targetColumnId);
    if (!targetColumn) {
      return;
    }

    // Calculate the target order (1-based)
    let targetOrder = 1;
    if (dropIndex !== undefined) {
      // Dropped at a specific position (1-based)
      targetOrder = dropIndex + 1;
    } else if (targetColumn.cards && targetColumn.cards.length > 0) {
      // Dropped at the end of the column
      targetOrder = targetColumn.cards.length + 1;
    }

    // Only move if the card is actually changing position or column
    const isSameColumn = draggedCard.boardColumnId === targetColumnId;
    const isSamePosition = isSameColumn && draggedCard.order === targetOrder;

    if (!isSamePosition) {
      await uiStore.moveCard(draggedCard.id, targetColumnId, targetOrder);
    }

    setDraggedCard(null);
    setDraggedOverColumnId(null);
  };

  const handleDropOnCard = async (e: React.DragEvent, targetCard: CardDto) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedCard || !draggedCard.id || !targetCard.boardColumnId) {
      return;
    }

    // Don't do anything if dropping on itself
    if (draggedCard.id === targetCard.id) {
      return;
    }

    const targetOrder = targetCard.order ?? 1;
    await uiStore.moveCard(draggedCard.id, targetCard.boardColumnId, targetOrder);

    setDraggedCard(null);
    setDraggedOverColumnId(null);
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
                    <div className="board-detail-page__column-header">
                      <Typography variant="h6" gutterBottom>
                        {column.name || 'Untitled Column'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Order: {column.order ?? 'N/A'}
                      </Typography>
                    </div>

                    <div 
                      className="board-detail-page__cards"
                      onDragOver={handleDragOver}
                      onDragEnter={() => column.id && handleDragEnterColumn(column.id)}
                      onDragLeave={handleDragLeaveColumn}
                      onDrop={(e) => column.id && handleDrop(e, column.id)}
                      role="list"
                      style={{
                        backgroundColor: draggedOverColumnId === column.id ? '#f0f0f0' : 'transparent',
                      }}
                    >
                      {column.cards && column.cards.length > 0 ? (
                        column.cards.map((card) => (
                          <Card 
                            key={card.id} 
                            className="board-detail-page__card" 
                            variant="outlined"
                            draggable
                            onClick={() => {
                              // Only trigger edit if not dragging
                              if (!draggedCard) {
                                handleEditCardClick(card);
                              }
                            }}
                            onDragStart={(e) => handleDragStart(e, card)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => {
                              e.stopPropagation();
                              handleDragOver(e);
                            }}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleDropOnCard(e, card);
                            }}
                            sx={{
                              cursor: draggedCard ? 'move' : 'pointer',
                              opacity: draggedCard?.id === card.id ? 0.5 : 1,
                            }}
                          >
                            <CardContent>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {card.description || 'No description'}
                              </Typography>
                              <Chip
                                label={card.assignedUser?.username || 'Unassigned'}
                                size="small"
                                color={card.assignedUser ? 'primary' : 'default'}
                                variant={card.assignedUser ? 'filled' : 'outlined'}
                              />
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          No cards yet
                        </Typography>
                      )}
                    </div>

                    <Box className="board-detail-page__add-card">
                      <Fab
                        size="small"
                        color="primary"
                        aria-label="add card"
                        onClick={() => column.id && handleAddCardClick(column.id)}
                      >
                        <AddIcon />
                      </Fab>
                    </Box>
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

      <AddCardDialog
        open={addCardDialogOpen}
        onClose={handleAddCardClose}
        onSubmit={handleAddCardSubmit}
        loading={uiStore.isLoading}
      />

      <EditCardDialog
        open={editCardDialogOpen}
        card={selectedCard}
        onClose={handleEditCardClose}
        onSubmit={handleEditCardSubmit}
        loading={uiStore.isLoading}
      />
    </Container>
  );
});

export default BoardDetailPage;
