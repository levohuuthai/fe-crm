import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface CreateContactFormProps {
  newContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    leadStatus: string;
  };
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLeadStatusChange: (event: any) => void;
  onSubmit: () => void;
}

const CreateContactForm: React.FC<CreateContactFormProps> = ({
  newContact,
  onClose,
  onChange,
  onLeadStatusChange,
  onSubmit
}) => {
  const { t } = useTranslation();
  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('pages.contacts.form.createTitle')}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
            <TextField
              name="firstName"
              label={t('pages.contacts.form.fields.firstName')}
              fullWidth
              required
              value={newContact.firstName}
              onChange={onChange}
              autoFocus
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
            <TextField
              name="lastName"
              label={t('pages.contacts.form.fields.lastName')}
              fullWidth
              value={newContact.lastName}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="email"
              label={t('pages.contacts.form.fields.email')}
              type="email"
              fullWidth
              required
              value={newContact.email}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="phone"
              label={t('pages.contacts.form.fields.phone')}
              fullWidth
              value={newContact.phone}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="jobTitle"
              label={t('pages.contacts.form.fields.jobTitle')}
              fullWidth
              value={newContact.jobTitle}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{t('pages.contacts.form.fields.leadStatus')}</InputLabel>
              <Select
                value={newContact.leadStatus}
                label={t('pages.contacts.form.fields.leadStatus')}
                onChange={onLeadStatusChange}
              >
                <MenuItem value="New">{t('pages.contacts.form.options.leadStatus.new')}</MenuItem>
                <MenuItem value="Contacted">{t('pages.contacts.form.options.leadStatus.contacted')}</MenuItem>
                <MenuItem value="Qualified">{t('pages.contacts.form.options.leadStatus.qualified')}</MenuItem>
                <MenuItem value="Lost">{t('pages.contacts.form.options.leadStatus.lost')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('pages.contacts.form.actions.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {t('pages.contacts.form.actions.save')}
        </Button>
      </DialogActions>
    </>
  );
};

export default CreateContactForm;
