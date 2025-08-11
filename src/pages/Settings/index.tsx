import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cài đặt
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Nội dung cài đặt sẽ được cập nhật sau</Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
