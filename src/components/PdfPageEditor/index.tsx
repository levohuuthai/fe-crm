import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, PictureAsPdf as PdfIcon, Print as PrintIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import RichTextEditor from '../RichTextEditor';

// Đăng ký font chữ hỗ trợ tiếng Việt
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});

// Đăng ký font Noto Sans hỗ trợ tiếng Việt tốt hơn
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.1/files/noto-sans-vietnamese-400-normal.woff', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.1/files/noto-sans-vietnamese-700-normal.woff', fontWeight: 'bold' },
  ],
});

// Đăng ký font Source Sans Pro hỗ trợ tiếng Việt
Font.register({
  family: 'SourceSansPro',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Italic.ttf', fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});

// Đặt font mặc định cho toàn bộ PDF
Font.registerHyphenationCallback(word => [word]);

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78; // Approximate conversion factor

// Calculate pixel dimensions based on 96 DPI
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;

// Reduced padding for better space utilization
const PAGE_PADDING = '10mm';

// Định nghĩa styles cho PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'SourceSansPro',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SourceSansPro',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'SourceSansPro',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'SourceSansPro',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontFamily: 'SourceSansPro',
  },
  tableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontFamily: 'SourceSansPro',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 20,
    textAlign: 'right',
    color: 'grey',
    fontFamily: 'SourceSansPro',
  },
});

// Hàm chuyển đổi HTML thành cấu trúc dữ liệu cho React-PDF
const parseHtmlContent = (htmlContent: string) => {
  // Tạo một DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Mảng chứa các phần tử đã parse
  const parsedElements: any[] = [];
  
  // Xử lý các phần tử con
  const processNode = (node: Node, depth = 0): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        // Đảm bảo hiển thị đúng tiếng Việt bằng cách giữ nguyên mã Unicode
        return { type: 'text', content: text };
      }
      return null;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      // Xử lý các loại phần tử khác nhau
      switch (tagName) {
        case 'h1':
          return { type: 'heading1', content: element.textContent || '' };
        case 'h2':
          return { type: 'heading2', content: element.textContent || '' };
        case 'p':
          return { type: 'paragraph', content: element.textContent || '' };
        case 'strong':
        case 'b':
          return { type: 'bold', content: element.textContent || '' };
        case 'em':
        case 'i':
          return { type: 'italic', content: element.textContent || '' };
        case 'u':
          return { type: 'underline', content: element.textContent || '' };
        case 'table':
          const rows: any[] = [];
          const tableRows = element.querySelectorAll('tr');
          
          tableRows.forEach((row, rowIndex) => {
            const cells: any[] = [];
            const isHeader = rowIndex === 0 || row.querySelector('th');
            
            row.querySelectorAll('th, td').forEach((cell) => {
              cells.push({
                content: cell.textContent || '',
                isHeader: cell.tagName.toLowerCase() === 'th',
              });
            });
            
            rows.push({ cells, isHeader });
          });
          
          return { type: 'table', rows };
        case 'ul':
        case 'ol':
          const items: string[] = [];
          element.querySelectorAll('li').forEach((li) => {
            items.push(li.textContent || '');
          });
          return { 
            type: tagName === 'ul' ? 'bulletList' : 'numberedList', 
            items 
          };
        default:
          // Xử lý các phần tử có phần tử con
          const children: any[] = [];
          element.childNodes.forEach((child) => {
            const processed = processNode(child, depth + 1);
            if (processed) {
              children.push(processed);
            }
          });
          
          if (children.length > 0) {
            return { type: 'container', children };
          }
          return null;
      }
    }
    
    return null;
  };
  
  // Xử lý tất cả các phần tử con của body
  doc.body.childNodes.forEach((node) => {
    const processed = processNode(node);
    if (processed) {
      parsedElements.push(processed);
    }
  });
  
  return parsedElements;
};

// Component để render các phần tử đã parse
const RenderPdfElement = ({ element }: { element: any }) => {
  switch (element.type) {
    case 'heading1':
      return <Text style={styles.title}>{element.content}</Text>;
    case 'heading2':
      return <Text style={styles.subtitle}>{element.content}</Text>;
    case 'paragraph':
      return <Text style={styles.text}>{element.content}</Text>;
    case 'bold':
      return <Text style={{ ...styles.text, fontWeight: 'bold' }}>{element.content}</Text>;
    case 'italic':
      return <Text style={{ ...styles.text, fontStyle: 'italic' }}>{element.content}</Text>;
    case 'underline':
      return <Text style={{ ...styles.text, textDecoration: 'underline' }}>{element.content}</Text>;
    case 'text':
      return <Text style={styles.text}>{element.content}</Text>;
    case 'table':
      return (
        <View style={styles.table as any}>
          {element.rows.map((row: any, rowIndex: number) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.cells.map((cell: any, cellIndex: number) => {
                const cellStyle = cell.isHeader || row.isHeader ? styles.tableHeaderCell : styles.tableCell;
                return (
                  <View key={cellIndex} style={[cellStyle, { flex: 1 }]}>
                    <Text>{cell.content}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      );
    case 'bulletList':
      return (
        <View style={{ marginLeft: 10 }}>
          {element.items.map((item: string, index: number) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ marginRight: 5 }}>•</Text>
              <Text style={styles.text}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'numberedList':
      return (
        <View style={{ marginLeft: 10 }}>
          {element.items.map((item: string, index: number) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ marginRight: 5 }}>{index + 1}.</Text>
              <Text style={styles.text}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'container':
      return (
        <View>
          {element.children.map((child: any, index: number) => (
            <RenderPdfElement key={index} element={child} />
          ))}
        </View>
      );
    default:
      return null;
  }
};

// Component để render PDF
const PdfDocument = ({ pages }: { pages: string[] }) => (
  <Document>
    {pages.map((content, index) => {
      const parsedContent = parseHtmlContent(content);
      return (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            {parsedContent.map((element, elementIndex) => (
              <RenderPdfElement key={elementIndex} element={element} />
            ))}
            <Text style={styles.pageNumber}>Trang {index + 1}</Text>
          </View>
        </Page>
      );
    })}
  </Document>
);

interface PdfPageProps {
  content: string;
  pageNumber: number;
  isEditing: boolean;
  onContentChange: (content: string) => void;
}

const PdfPage: React.FC<PdfPageProps> = ({ content, pageNumber, isEditing, onContentChange }) => {
  const handleContentChange = (newContent: string) => {
    onContentChange(newContent);
  };

  return (
    <Paper 
      elevation={2}
      className="pdf-page"
      data-page-number={pageNumber}
      sx={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        maxWidth: '100%', // Đảm bảo không vượt quá chiều rộng của container
        padding: PAGE_PADDING,
        margin: '0 0 20px 0', // Chỉ để margin dưới, bỏ margin trái phải
        position: 'relative',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        '@media print': {
          boxShadow: 'none',
          margin: 0,
          padding: PAGE_PADDING,
          pageBreakAfter: 'always',
          '&:last-child': {
            pageBreakAfter: 'auto',
          },
        },
      }}
    >
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden',
        '& .ProseMirror': {
          overflow: 'hidden !important', // Ngăn scroll trong editor
          height: '100%',
          '& table': {
            borderCollapse: 'collapse',
            margin: '1rem 0',
            width: '100%',
            tableLayout: 'fixed',
            border: '1px solid #000',
          },
          '& table td, & table th': {
            border: '1px solid #000',
            padding: '8px 12px',
            position: 'relative',
            textAlign: 'left',
            verticalAlign: 'top',
          },
          '& table th': {
            backgroundColor: '#f3f3f3',
            fontWeight: 'bold',
          },
        }
      }}>
        <RichTextEditor 
          content={content} 
          onChange={handleContentChange} 
          readOnly={!isEditing}
        />
      </Box>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 10, 
        right: 10, 
        fontSize: '12px', 
        color: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        px: 1,
        borderRadius: 1
      }}>
        Trang {pageNumber}
      </Box>
    </Paper>
  );
};

interface PdfPageEditorProps {
  initialContent: string[];
  onSave: (pages: string[]) => void;
  onExportPdf?: () => void;
}

export const PdfPageEditor: React.FC<PdfPageEditorProps> = ({
  initialContent,
  onSave,
  onExportPdf,
}) => {
  const [pages, setPages] = useState<string[]>(initialContent);  
  const [isEditing, setIsEditing] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize with empty content if no content is provided
  useEffect(() => {
    if (initialContent.length === 0) {
      setPages(['<p>Nhập nội dung tại đây...</p>']);
    }
  }, [initialContent]);

  const handleAddPage = () => {
    setPages([...pages, '<p>Nhập nội dung tại đây...</p>']);
  };
  
  const handleRemovePage = (index: number) => {
    if (pages.length <= 1) return; // Don't remove the last page
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
  };

  const handlePageContentChange = (index: number, content: string) => {
    const newPages = [...pages];
    newPages[index] = content;
    setPages(newPages);
  };

  const toggleEdit = () => {
    const newEditState = !isEditing;
    setIsEditing(newEditState);
    
    // Save when toggling out of edit mode
    if (newEditState === false) {
      onSave(pages);
    }
  };

  const handleExportPdf = async () => {
    try {
      // Tạo một instance của Document
      const pdfDoc = <PdfDocument pages={pages} />;
      
      // Tạo blob từ document
      const blob = await pdf(pdfDoc).toBlob();
      
      // Tạo URL từ blob
      const url = URL.createObjectURL(blob);
      
      // Tạo link tải xuống
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bao-gia.pdf';
      link.click();
      
      // Giải phóng URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      if (onExportPdf) {
        onExportPdf();
      }
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 48px)', // Trừ đi chiều cao của AppBar nếu có
      bgcolor: '#f8f9fa',
      overflow: 'hidden' // Ngăn không cho scroll ở container ngoài cùng
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 250, 
        bgcolor: 'white', 
        p: 2, 
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto' // Cho phép sidebar scroll nếu cần
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Tài liệu</Typography>
        
        <Button 
          variant="contained" 
          fullWidth
          onClick={toggleEdit}
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          sx={{ mb: 1, justifyContent: 'flex-start' }}
        >
          {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
        </Button>
        
        <Button 
          variant="outlined" 
          fullWidth
          onClick={handleExportPdf}
          startIcon={<PdfIcon />}
          sx={{ mb: 1, justifyContent: 'flex-start' }}
        >
          Xuất PDF
        </Button>
        
        <Button 
          variant="outlined" 
          fullWidth
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{ mb: 3, justifyContent: 'flex-start' }}
        >
          In tài liệu
        </Button>

        {isEditing && (
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            onClick={handleAddPage}
            startIcon={<AddIcon />}
            sx={{ mt: 'auto', mb: 2 }}
          >
            Thêm trang mới
          </Button>
        )}
      </Box>

      {/* Main Content - Chỉ cho phép scroll ở đây */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        overflowY: 'auto',
        overflowX: 'hidden', // Ngăn scroll ngang
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Căn giữa nội dung
      }}>
        <Box 
          ref={contentRef}
          sx={{ 
            width: 'fit-content', // Để tự động co giãn theo nội dung
            maxWidth: '100%', // Đảm bảo không vượt quá chiều rộng của container
            bgcolor: 'transparent', // Loại bỏ nền trắng của khung
            p: 0, // Loại bỏ padding không cần thiết
          }}
        >
          {pages.map((page, index) => (
            <Box 
              key={index} 
              sx={{ 
                position: 'relative',
                mb: 4,
                '&:hover .page-actions': {
                  opacity: 1
                }
              }}
            >
              <PdfPage
                content={page}
                pageNumber={index + 1}
                isEditing={isEditing}
                onContentChange={(content) => handlePageContentChange(index, content)}
              />
              {isEditing && (
                <Box 
                  className="page-actions"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <IconButton 
                    onClick={() => handleRemovePage(index)}
                    size="small"
                    sx={{ 
                      backgroundColor: 'error.light',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                    }}
                    disabled={pages.length <= 1}
                    title="Xóa trang"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PdfPageEditor;
