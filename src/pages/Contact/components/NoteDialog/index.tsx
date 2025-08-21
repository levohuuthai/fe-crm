import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
}

const NoteDialog: React.FC<NoteDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('pages.contacts.note.title')}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="note"
          label={t('pages.contacts.note.fields.note')}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 2 }}
        >
          {t('pages.contacts.note.actions.attachFile')}
          <input
            type="file"
            hidden
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('pages.contacts.note.actions.cancel')}</Button>
        <Button onClick={onClose} variant="contained" color="primary">
          {t('pages.contacts.note.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
