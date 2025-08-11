import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Divider,
} from '@mui/material';

const PerformanceTest: React.FC = () => {
  // State for regular HTML inputs
  const [regularText, setRegularText] = useState('');
  const [regularSelect, setRegularSelect] = useState('');
  const [regularCheckbox, setRegularCheckbox] = useState(false);
  const [regularRadio, setRegularRadio] = useState('option1');
  const [regularRange, setRegularRange] = useState(50);

  // State for MUI inputs
  const [muiText, setMuiText] = useState('');
  const [muiSelect, setMuiSelect] = useState('');
  const [muiCheckbox, setMuiCheckbox] = useState(false);
  const [muiRadio, setMuiRadio] = useState('option1');
  const [muiSlider, setMuiSlider] = useState(50);
  const [muiAutocomplete, setMuiAutocomplete] = useState<string | null>(null);

  // Dialog states
  const [regularDialogOpen, setRegularDialogOpen] = useState(false);
  const [muiDialogOpen, setMuiDialogOpen] = useState(false);
  const [muiDialogNoTransitionOpen, setMuiDialogNoTransitionOpen] = useState(false);

  // Options for select and autocomplete
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  // Handle regular dialog
  const openRegularDialog = () => setRegularDialogOpen(true);
  const closeRegularDialog = () => setRegularDialogOpen(false);

  // Handle MUI dialog
  const openMuiDialog = () => setMuiDialogOpen(true);
  const closeMuiDialog = () => setMuiDialogOpen(false);

  // Handle MUI dialog without transition
  const openMuiDialogNoTransition = () => setMuiDialogNoTransitionOpen(true);
  const closeMuiDialogNoTransition = () => setMuiDialogNoTransitionOpen(false);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Performance Test: HTML vs MUI Components
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
        {/* Regular HTML Components */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Regular HTML Components
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <label htmlFor="regular-text">Text Input:</label>
            <input
              id="regular-text"
              type="text"
              value={regularText}
              onChange={(e) => setRegularText(e.target.value)}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '8px',
                marginTop: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <label htmlFor="regular-select">Select:</label>
            <select
              id="regular-select"
              value={regularSelect}
              onChange={(e) => setRegularSelect(e.target.value)}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '8px',
                marginTop: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={regularCheckbox}
                onChange={(e) => setRegularCheckbox(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Checkbox
            </label>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              <legend>Radio Options:</legend>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                <input
                  type="radio"
                  value="option1"
                  checked={regularRadio === 'option1'}
                  onChange={(e) => setRegularRadio(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                Option 1
              </label>
              <label style={{ display: 'block' }}>
                <input
                  type="radio"
                  value="option2"
                  checked={regularRadio === 'option2'}
                  onChange={(e) => setRegularRadio(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                Option 2
              </label>
            </fieldset>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <label htmlFor="regular-range">Range: {regularRange}</label>
            <input
              id="regular-range"
              type="range"
              min="0"
              max="100"
              value={regularRange}
              onChange={(e) => setRegularRange(Number(e.target.value))}
              style={{ 
                display: 'block', 
                width: '100%',
                marginTop: '8px'
              }}
            />
          </Box>
          
          <button 
            onClick={openRegularDialog}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Regular Dialog
          </button>
          
          {/* Regular HTML Dialog */}
          {regularDialogOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '4px',
                maxWidth: '500px',
                width: '100%'
              }}>
                <h2>Regular HTML Dialog</h2>
                <p>This is a dialog created with regular HTML and CSS.</p>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button 
                    onClick={closeRegularDialog}
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </Paper>
        
        {/* MUI Components */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Material-UI Components
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Text Input"
              variant="outlined"
              fullWidth
              value={muiText}
              onChange={(e) => setMuiText(e.target.value)}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select</InputLabel>
              <Select
                value={muiSelect}
                label="Select"
                onChange={(e) => setMuiSelect(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={muiCheckbox}
                  onChange={(e) => setMuiCheckbox(e.target.checked)}
                />
              }
              label="Checkbox"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={muiRadio}
                onChange={(e) => setMuiRadio(e.target.value)}
              >
                <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Range: {muiSlider}</Typography>
            <Slider
              value={muiSlider}
              onChange={(_, newValue) => setMuiSlider(newValue as number)}
              aria-labelledby="mui-slider"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              options={options}
              value={muiAutocomplete}
              onChange={(_, newValue) => setMuiAutocomplete(newValue)}
              renderInput={(params) => <TextField {...params} label="Autocomplete" />}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={openMuiDialog}>
              Open MUI Dialog (with transition)
            </Button>
            
            <Button variant="contained" onClick={openMuiDialogNoTransition}>
              Open MUI Dialog (no transition)
            </Button>
          </Box>
          
          {/* MUI Dialog with default transition */}
          <Dialog
            open={muiDialogOpen}
            onClose={closeMuiDialog}
          >
            <DialogTitle>MUI Dialog with Default Transition</DialogTitle>
            <DialogContent>
              <Typography>
                This is a dialog created with Material-UI with default transition settings.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeMuiDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          
          {/* MUI Dialog without transition */}
          <Dialog
            open={muiDialogNoTransitionOpen}
            onClose={closeMuiDialogNoTransition}
            transitionDuration={0}
          >
            <DialogTitle>MUI Dialog without Transition</DialogTitle>
            <DialogContent>
              <Typography>
                This is a dialog created with Material-UI with transition duration set to 0.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeMuiDialogNoTransition}>Close</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Performance Tips */}
      <Typography variant="h5" gutterBottom>
        Performance Tips for MUI
      </Typography>
      
      <Box component="ul" sx={{ pl: 2 }}>
        <li>
          <Typography>
            <strong>Disable Ripple Effect:</strong> Add <code>disableRipple</code> prop to buttons and other interactive elements.
          </Typography>
        </li>
        <li>
          <Typography>
            <strong>Set Transition Duration to 0:</strong> Use <code>transitionDuration={'{0}'}</code> for dialogs and other components with transitions.
          </Typography>
        </li>
        <li>
          <Typography>
            <strong>Use React.memo:</strong> Wrap components in <code>React.memo()</code> to prevent unnecessary re-renders.
          </Typography>
        </li>
        <li>
          <Typography>
            <strong>Disable Portal:</strong> Add <code>disablePortal</code> prop to dialogs, popovers, and tooltips.
          </Typography>
        </li>
        <li>
          <Typography>
            <strong>Optimize Autocomplete:</strong> Use <code>disableListWrap</code>, <code>disablePortal</code>, and limit the number of options.
          </Typography>
        </li>
      </Box>
    </Box>
  );
};

export default PerformanceTest;
