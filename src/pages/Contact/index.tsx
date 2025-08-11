import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Drawer,
  Typography
} from '@mui/material';
import {
  FileUpload as FileUploadIcon
} from '@mui/icons-material';

// Import custom components
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import CreateContactForm from './components/CreateContactForm';
import EmailWindow from './components/EmailWindow';
import NoteDialog from './components/NoteDialog';

// Mock data for contacts
const mockContacts = [
  {
    id: 1,
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    owner: 'Admin User',
    createDate: '2023-07-15',
    leadStatus: 'New'
  },
  {
    id: 2,
    firstName: 'Trần',
    lastName: 'Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    owner: 'Sales Rep',
    createDate: '2023-07-10',
    leadStatus: 'Qualified'
  },
  {
    id: 3,
    firstName: 'Lê',
    lastName: 'Văn C',
    email: 'levanc@example.com',
    phone: '0923456789',
    owner: 'Admin User',
    createDate: '2023-07-05',
    leadStatus: 'Contacted'
  },
  {
    id: 4,
    firstName: 'Phạm',
    lastName: 'Thị D',
    email: 'phamthid@example.com',
    phone: '0934567890',
    owner: 'Sales Rep',
    createDate: '2023-06-30',
    leadStatus: 'New'
  },
  {
    id: 5,
    firstName: 'Hoàng',
    lastName: 'Văn E',
    email: 'hoangvane@example.com',
    phone: '0945678901',
    owner: 'Admin User',
    createDate: '2023-06-25',
    leadStatus: 'Qualified'
  },
];

// Column definitions
const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'phone', label: 'Phone Number', minWidth: 120 },
  { id: 'owner', label: 'Contact Owner', minWidth: 120 },
  { id: 'createDate', label: 'Create Date', minWidth: 100 },
  { id: 'leadStatus', label: 'Lead Status', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 80 },
];

const ContactManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openEmailWindow, setOpenEmailWindow] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    leadStatus: 'New'
  });

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredContacts.map((n) => n.id);
      setSelectedContacts(newSelected);
      return;
    }
    setSelectedContacts([]);
  };

  const handleCheckboxClick = (id: number) => {
    const selectedIndex = selectedContacts.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedContacts, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedContacts.slice(1));
    } else if (selectedIndex === selectedContacts.length - 1) {
      newSelected = newSelected.concat(selectedContacts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedContacts.slice(0, selectedIndex),
        selectedContacts.slice(selectedIndex + 1),
      );
    }

    setSelectedContacts(newSelected);
  };

  const isSelected = (id: number) => selectedContacts.indexOf(id) !== -1;

  // Handle create contact dialog
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      leadStatus: 'New'
    });
  };

  const handleCreateContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
  };

  const handleLeadStatusChange = (event: any) => {
    setNewContact({
      ...newContact,
      leadStatus: event.target.value
    });
  };

  const handleCreateContact = () => {
    // In a real app, this would send data to an API
    console.log('Creating contact:', newContact);
    handleCloseCreateDialog();
    // Show success notification (would use a proper notification system in a real app)
    alert('✅ Contact created successfully!');
  };

  // Handle contact drawer
  const handleOpenContactDrawer = (contact: any) => {
    setSelectedContact(contact);
    setOpenContactDrawer(true);
  };

  const handleCloseContactDrawer = () => {
    setOpenContactDrawer(false);
  };

  // Handle note dialog
  const handleOpenNoteDialog = () => {
    setOpenNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
  };

  // Handle email window
  const handleOpenEmailWindow = () => {
    setOpenEmailWindow(true);
  };

  const handleCloseEmailWindow = () => {
    setOpenEmailWindow(false);
  };

  // Filter contacts based on search term
  const filteredContacts = mockContacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    );
  });

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Contact List */}
      <ContactList
        contacts={mockContacts}
        searchTerm={searchTerm}
        page={page}
        rowsPerPage={rowsPerPage}
        selectedContacts={selectedContacts}
        onSearchChange={handleSearchChange}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onSelectAllClick={handleSelectAllClick}
        onCheckboxClick={handleCheckboxClick}
        onOpenCreateDialog={handleOpenCreateDialog}
        onOpenContactDrawer={handleOpenContactDrawer}
        getInitials={getInitials}
        isSelected={isSelected}
      />

      {/* Create Contact Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
      >
        <CreateContactForm
          newContact={newContact}
          onClose={handleCloseCreateDialog}
          onChange={handleCreateContactChange}
          onLeadStatusChange={handleLeadStatusChange}
          onSubmit={handleCreateContact}
        />
      </Dialog>

      {/* Contact Preview Drawer */}
      <Drawer
        anchor="right"
        open={openContactDrawer}
        onClose={(_, reason) => {
          // Only close when explicitly clicking the backdrop (not when interacting with email window)
          if (reason === 'backdropClick') {
            const emailWindow = document.querySelector('.email-window');
            // If clicking on email window, don't close the drawer
            if (emailWindow && emailWindow.contains(document.activeElement)) {
              return;
            }
          }
          handleCloseContactDrawer();
        }}
        ModalProps={{
          BackdropProps: {
            sx: { backgroundColor: 'transparent' }
          }
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: 500 },
            p: 2
          },
        }}
      >
        {selectedContact && (
          <ContactDetails
            contact={selectedContact}
            onClose={handleCloseContactDrawer}
            onOpenEmailWindow={handleOpenEmailWindow}
            onOpenNoteDialog={handleOpenNoteDialog}
          />
        )}
      </Drawer>

      {/* Note Dialog */}
      <NoteDialog 
        open={openNoteDialog} 
        onClose={handleCloseNoteDialog}
      />

      {/* Email Window (Draggable) */}
      <EmailWindow
        open={openEmailWindow}
        onClose={handleCloseEmailWindow}
        recipientEmail={selectedContact?.email || ''}
        fromContactDetails={true}
      />
    </Box>
  );
};

export default ContactManagement;
