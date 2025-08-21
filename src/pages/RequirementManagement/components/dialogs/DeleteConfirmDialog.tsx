import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { DeleteConfirmDialogProps } from '../../types';
import { useTranslation } from 'react-i18next';

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}) => {
  const { t } = useTranslation();

  const localTitle =
    title ?? t('pages.requirements.dialogs.deleteConfirmTitle', { defaultValue: 'Delete confirmation' });
  const localContent =
    content ?? t('pages.requirements.dialogs.deleteConfirmText', { defaultValue: 'Are you sure you want to delete this requirement?' });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {localTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {localContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          {t('common.delete', { defaultValue: 'Delete' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
