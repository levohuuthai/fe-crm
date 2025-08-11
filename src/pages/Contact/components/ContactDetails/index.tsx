import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Note as NoteIcon,
  Event as EventIcon,
  Assignment as TaskIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owner: string;
  createDate: string;
  leadStatus: string;
}

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
  onOpenEmailWindow: () => void;
  onOpenNoteDialog: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  contact,
  onClose,
  onOpenEmailWindow,
  onOpenNoteDialog
}) => {
  const [hoverName, setHoverName] = useState(false);
  const [hoverEmail, setHoverEmail] = useState(false);
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    alert('Email copied to clipboard!');
  };
  return (
    <Box sx={{ fontSize: '0.9rem' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Contact Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box mb={2}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setHoverName(true)}
          onMouseLeave={() => setHoverName(false)}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
            {contact.firstName} {contact.lastName}
          </Typography>
          {hoverName && (
            <IconButton size="small" sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box 
          sx={{ display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setHoverEmail(true)}
          onMouseLeave={() => setHoverEmail(false)}
        >
          <Typography color="text.secondary" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
            {contact.email}
          </Typography>
          {hoverEmail && (
            <IconButton size="small" sx={{ ml: 1 }} onClick={handleCopyEmail}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box display="flex" gap={0.5} mt={1.5}>
          <Tooltip title="Add Note">
            <IconButton color="primary" onClick={onOpenNoteDialog} size="small">
              <NoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Email">
            <IconButton color="primary" onClick={onOpenEmailWindow} size="small">
              <EmailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Call">
            <IconButton color="primary" size="small">
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Schedule">
            <IconButton color="primary" size="small">
              <EventIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Task">
            <IconButton color="primary" size="small">
              <TaskIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />
      
      <Card variant="outlined" sx={{ mb: 1.5 }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
              About this contact
            </Typography>
            <ExpandMoreIcon fontSize="small" />
          </Box>
          <Box mt={1.5} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Phone
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.85rem' }}>
                {contact.phone}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Lead Status
              </Typography>
              <Chip 
                label={contact.leadStatus} 
                color={
                  contact.leadStatus === 'New' ? 'primary' : 
                  contact.leadStatus === 'Qualified' ? 'success' : 
                  'warning'
                } 
                size="small" 
                sx={{ height: '20px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Owner
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.85rem' }}>
                {contact.owner}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Created
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.85rem' }}>
                {contact.createDate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
            Activity Timeline
          </Typography>
          <Box mt={1.5} display="flex" justifyContent="center" alignItems="center" height={80}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              No activities yet
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactDetails;
