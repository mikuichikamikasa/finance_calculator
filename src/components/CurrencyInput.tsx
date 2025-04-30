import React from 'react';
import { TextField, InputAdornment, Tooltip, Typography, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  helperText?: string;
  tooltipText?: string;
  fullWidth?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  tooltipText,
  fullWidth = true
}) => {
  // Format the value for display (empty string if 0)
  const displayValue = value === 0 ? '' : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input or valid numbers
    if (inputValue === '' || !isNaN(Number(inputValue))) {
      onChange(inputValue);
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography 
          variant="body1" 
          component="label" 
          htmlFor={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
          sx={{ 
            fontWeight: 500, 
            fontSize: '18px',
            color: 'primary.main'
          }}
        >
          {label}
        </Typography>
        {tooltipText && (
          <Tooltip title={tooltipText} arrow placement="top">
            <HelpOutlineIcon 
              fontSize="small" 
              color="action" 
              sx={{ ml: 1, cursor: 'pointer' }} 
            />
          </Tooltip>
        )}
      </Box>
      <TextField
        id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
        value={displayValue}
        onChange={handleChange}
        type="text"
        variant="outlined"
        fullWidth={fullWidth}
        helperText={helperText}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        // Mobile-friendly enhancements
        sx={{
          '& .MuiInputBase-root': { 
            height: '60px', 
            fontSize: '18px'
          },
          '& .MuiFormHelperText-root': { 
            fontSize: '14px',
            marginTop: '8px'
          }
        }}
        // Better mobile keyboard
        inputProps={{
          inputMode: 'decimal',
          pattern: '[0-9]*',
          style: { fontSize: '18px' }
        }}
      />
    </Box>
  );
}; 