import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { TDSCalculatorForm } from './components/TDSCalculatorForm';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E5984', // Canadian blue
    },
    secondary: {
      main: '#D80621', // Canadian red
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TDSCalculatorForm />
    </ThemeProvider>
  );
}

export default App;
