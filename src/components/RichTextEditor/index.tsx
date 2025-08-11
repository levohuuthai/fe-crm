import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Box, ButtonGroup, IconButton } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  Image as ImageIcon,
  TableChart,
  Delete as DeleteIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';


interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, readOnly = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !readOnly,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const addColumnBefore = useCallback(() => {
    editor?.chain().focus().addColumnBefore().run();
  }, [editor]);

  const addColumnAfter = useCallback(() => {
    editor?.chain().focus().addColumnAfter().run();
  }, [editor]);

  const addRowBefore = useCallback(() => {
    editor?.chain().focus().addRowBefore().run();
  }, [editor]);

  const addRowAfter = useCallback(() => {
    editor?.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor?.chain().focus().deleteRow().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor?.chain().focus().deleteColumn().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor?.chain().focus().deleteTable().run();
  }, [editor]);

  if (!editor) {
    return <div>Đang tải trình soạn thảo...</div>;
  }

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f5f5f5',
        }}
      >
        {/* Text Formatting Buttons */}
        <ButtonGroup size="small" variant="text">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive('bold') ? 'primary' : 'default'}
            title="Đậm"
          >
            <FormatBold />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive('italic') ? 'primary' : 'default'}
            title="Nghiêng"
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color={editor.isActive('underline') ? 'primary' : 'default'}
            title="Gạch chân"
          >
            <FormatBold sx={{ textDecoration: 'underline' }} />
          </IconButton>
        </ButtonGroup>

        {/* List Buttons */}
        <ButtonGroup size="small" variant="text">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive('bulletList') ? 'primary' : 'default'}
            title="Danh sách không thứ tự"
          >
            <FormatListBulleted />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive('orderedList') ? 'primary' : 'default'}
            title="Danh sách có thứ tự"
          >
            <FormatListNumbered />
          </IconButton>
        </ButtonGroup>

        {/* Table Controls */}
        <ButtonGroup size="small" variant="text">
          <IconButton
            onClick={addTable}
            title="Chèn bảng"
          >
            <TableChart />
          </IconButton>
          <IconButton
            onClick={addRowBefore}
            disabled={!editor.can().addRowBefore()}
            title="Thêm hàng phía trên"
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            onClick={addRowAfter}
            disabled={!editor.can().addRowAfter()}
            title="Thêm hàng phía dưới"
          >
            <ArrowDownIcon />
          </IconButton>
          <IconButton
            onClick={addColumnBefore}
            disabled={!editor.can().addColumnBefore()}
            title="Thêm cột bên trái"
          >
            <ArrowLeftIcon />
          </IconButton>
          <IconButton
            onClick={addColumnAfter}
            disabled={!editor.can().addColumnAfter()}
            title="Thêm cột bên phải"
          >
            <ArrowRightIcon />
          </IconButton>
          <IconButton
            onClick={deleteRow}
            disabled={!editor.can().deleteRow()}
            title="Xóa hàng"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={deleteColumn}
            disabled={!editor.can().deleteColumn()}
            title="Xóa cột"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={deleteTable}
            disabled={!editor.can().deleteTable()}
            title="Xóa bảng"
          >
            <TableChart />
          </IconButton>
        </ButtonGroup>

        {/* Image Upload */}
        <ButtonGroup size="small" variant="text">
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            title="Chèn ảnh"
          >
            <ImageIcon />
          </IconButton>
        </ButtonGroup>

        {/* Undo/Redo */}
        <ButtonGroup size="small" variant="text">
          <IconButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Hoàn tác"
          >
            <Undo />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Làm lại"
          >
            <Redo />
          </IconButton>
        </ButtonGroup>
      </Box>

      {/* Editor Content */}
      <Box sx={{ 
        p: 2, 
        minHeight: '300px', 
        maxHeight: '70vh', 
        overflowY: 'auto',
        '& .ProseMirror': {
          '& table': {
            borderCollapse: 'collapse',
            margin: '1rem 0',
            width: '100%',
            tableLayout: 'fixed',
          },
          '& table td, & table th': {
            border: '1px solid #ccc',
            padding: '8px 12px',
            position: 'relative',
            textAlign: 'left',
            verticalAlign: 'top',
          },
          '& table th': {
            backgroundColor: '#f3f3f3',
            fontWeight: 'bold',
          },
          '& table .selectedCell': {
            backgroundColor: 'rgba(200, 200, 255, 0.4)',
          },
        }
      }}>
        <EditorContent editor={editor} />
      </Box>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default RichTextEditor;
