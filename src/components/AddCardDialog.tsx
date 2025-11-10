import { useState } from 'react';
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

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
  loading?: boolean;
}

export const AddCardDialog = observer(({ open, onClose, onSubmit, loading = false }: AddCardDialogProps) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!description.trim()) {
      return;
    }

    await onSubmit(description);
    setDescription('');
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Card</DialogTitle>
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
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
