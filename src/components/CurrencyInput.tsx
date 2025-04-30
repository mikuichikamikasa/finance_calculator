import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Tooltip, 
  Typography, 
  Box,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  helperText?: string;
  tooltipText?: string;
  fullWidth?: boolean;
  allowPeriodToggle?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  tooltipText,
  fullWidth = true,
  allowPeriodToggle = false
}) => {
  // State for period (monthly or yearly)
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Format the value for display (empty string if 0)
  const displayValue = value === 0 ? '' : period === 'monthly' ? value.toString() : (value * 12).toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input or valid numbers
    if (inputValue === '' || !isNaN(Number(inputValue))) {
      // Convert to monthly value if user is entering yearly
      const monthlyValue = period === 'monthly' 
        ? inputValue 
        : (parseFloat(inputValue) / 12).toString();
      
      onChange(monthlyValue);
    }
  };
  
  // Handle period change
  const handlePeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriod: 'monthly' | 'yearly',
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        
        {allowPeriodToggle && (
          <ToggleButtonGroup
            size="small"
            value={period}
            exclusive
            onChange={handlePeriodChange}
            aria-label="Payment period"
            sx={{ ml: 1 }}
          >
            <ToggleButton 
              value="monthly" 
              aria-label="Monthly"
              sx={{ 
                py: 0.5, 
                px: 1.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' } 
              }}
            >
              Monthly
            </ToggleButton>
            <ToggleButton 
              value="yearly" 
              aria-label="Yearly"
              sx={{ 
                py: 0.5, 
                px: 1.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' } 
              }}
            >
              Yearly
            </ToggleButton>
          </ToggleButtonGroup>
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