import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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

interface ContactListProps {
  contacts: Contact[];
  searchTerm: string;
  page: number;
  rowsPerPage: number;
  selectedContacts: number[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxClick: (id: number) => void;
  onOpenCreateDialog: () => void;
  onOpenContactDrawer: (contact: Contact) => void;
  getInitials: (firstName: string, lastName: string) => string;
  isSelected: (id: number) => boolean;
}

const columns = [
  { id: 'name', label: 'pages.contacts.columns.name', minWidth: 170 },
  { id: 'email', label: 'pages.contacts.columns.email', minWidth: 170 },
  { id: 'phone', label: 'pages.contacts.columns.phone', minWidth: 120 },
  { id: 'owner', label: 'pages.contacts.columns.owner', minWidth: 120 },
  { id: 'createDate', label: 'pages.contacts.columns.createDate', minWidth: 100 },
  { id: 'leadStatus', label: 'pages.contacts.columns.leadStatus', minWidth: 100 },
  { id: 'actions', label: 'pages.contacts.columns.actions', minWidth: 80 },
];

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  searchTerm,
  page,
  rowsPerPage,
  selectedContacts,
  onSearchChange,
  onChangePage,
  onChangeRowsPerPage,
  onSelectAllClick,
  onCheckboxClick,
  onOpenCreateDialog,
  onOpenContactDrawer,
  getInitials,
  isSelected
}) => {
  const { t } = useTranslation();
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const translatedColumns = React.useMemo(() => {
    return columns.map(col => ({ ...col, label: t(col.label as any) }));
  }, [t]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div">
          {t('common.contacts')}
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            ({filteredContacts.length})
          </Typography>
        </Typography>
        <Box display="flex" gap={1}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onOpenCreateDialog}
          >
            {t('pages.contacts.actions.createContact')}
          </Button>
        </Box>
      </Box>
      
      <Box px={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          placeholder={t('pages.contacts.searchPlaceholder')}
          size="small"
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>
      
      <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedContacts.length > 0 && selectedContacts.length < filteredContacts.length}
                  checked={filteredContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                  onChange={onSelectAllClick}
                />
              </TableCell>
              {translatedColumns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => {
                const isItemSelected = isSelected(contact.id);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={contact.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={() => onCheckboxClick(contact.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => onOpenContactDrawer(contact)}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getInitials(contact.firstName, contact.lastName)}
                        </Avatar>
                        <Typography>
                          {contact.firstName} {contact.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.owner}</TableCell>
                    <TableCell>{contact.createDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={contact.leadStatus} 
                        color={
                          contact.leadStatus === 'New' ? 'primary' : 
                          contact.leadStatus === 'Qualified' ? 'success' : 
                          'warning'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.more')}>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredContacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ContactList;
