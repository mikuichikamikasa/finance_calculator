import React, { ReactNode } from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </Paper>
  );
}; 