import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import type { CardDto } from '../api/LemonTaskManagementApiClient';

interface EditCardDialogProps {
  open: boolean;
  card: CardDto | null;
  onClose: () => void;
  onSubmit: (cardId: string, description: string) => Promise<void>;
  loading?: boolean;
}

export const EditCardDialog = observer(({ open, card, onClose, onSubmit, loading = false }: EditCardDialogProps) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (card) {
      setDescription(card.description || '');
    }
  }, [card]);

  const handleSubmit = async () => {
    if (!description.trim() || !card?.id) {
      return;
    }

    await onSubmit(card.id, description);
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Card</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Card Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Enter card description..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !description.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
