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
  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Create New Contact
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
              label="First Name"
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
              label="Last Name"
              fullWidth
              value={newContact.lastName}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="email"
              label="Email"
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
              label="Phone Number"
              fullWidth
              value={newContact.phone}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              name="jobTitle"
              label="Job Title"
              fullWidth
              value={newContact.jobTitle}
              onChange={onChange}
            />
          </Box>
          <Box sx={{ width: '100%', mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Lead Status</InputLabel>
              <Select
                value={newContact.leadStatus}
                label="Lead Status"
                onChange={onLeadStatusChange}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export default CreateContactForm;
