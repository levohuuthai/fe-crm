import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { QuoteTemplate } from '../../types/quoteTemplate';

interface QuotationTemplatesProps {
  templates: QuoteTemplate[];
  loading: boolean;
  onUploadClick: () => void;
  onViewTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onDownloadTemplate?: (templateId: string) => void;
}

const QuotationTemplates: React.FC<QuotationTemplatesProps> = ({
  templates,
  loading,
  onUploadClick,
  onViewTemplate,
  onDeleteTemplate,
  onDownloadTemplate,
}) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const lang = i18n.language || 'en';
    const locale = lang.startsWith('ja') ? 'ja-JP' : lang.startsWith('vi') ? 'vi-VN' : 'en-US';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">{t('pages.quotations.templates.title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onUploadClick}
        >
          {t('pages.quotations.templates.buttons.uploadTemplate')}
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('pages.quotations.templates.table.columns.name')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.description')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.type')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.status')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.createdAt')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.createdBy')}</TableCell>
              <TableCell>{t('pages.quotations.templates.table.columns.fields')}</TableCell>
              <TableCell align="center">{t('pages.quotations.tables.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('pages.quotations.templates.loading')}
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('pages.quotations.templates.table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description || '-'}</TableCell>
                  <TableCell>
                    {template.type === 'customer'
                      ? t('pages.quotations.templates.table.chips.type.customer')
                      : t('pages.quotations.templates.table.chips.type.internal')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.status === 'active'
                        ? t('pages.quotations.templates.table.chips.status.active')
                        : t('pages.quotations.templates.table.chips.status.inactive')}
                      color={template.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                    {template.isDefault && (
                      <Chip
                        label={t('pages.quotations.templates.table.chips.default')}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(template.createdAt)}
                  </TableCell>
                  <TableCell>{template.createdBy}</TableCell>
                  <TableCell>{template.placeholderCount}</TableCell>
                  <TableCell align="center">
                    <Box>
                      {onViewTemplate && (
                        <Tooltip title={t('pages.quotations.templates.table.tooltips.view')}>
                          <IconButton
                            size="small"
                            onClick={() => onViewTemplate(template.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDownloadTemplate && (
                        <Tooltip title={t('pages.quotations.templates.table.tooltips.download')}>
                          <IconButton
                            size="small"
                            onClick={() => onDownloadTemplate(template.id)}
                          >
                            <FileDownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDeleteTemplate && (
                        <Tooltip title={t('pages.quotations.templates.table.tooltips.delete')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteTemplate(template.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QuotationTemplates;
