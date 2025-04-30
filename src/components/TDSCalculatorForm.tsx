import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Stack,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  styled,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  alpha,
  Fade
} from '@mui/material';
import { CurrencyInput } from './CurrencyInput';
import { ResultsDisplay } from './ResultsDisplay';
import { useTDSCalculator } from '../hooks/useTDSCalculator';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Create a custom theme with blue colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#0a4d82',
      light: '#3b6d9b',
      dark: '#07345a',
    },
    background: {
      default: '#f5f8fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#1976d2',
          },
          '&.Mui-completed': {
            color: '#4caf50',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: -8,
        },
      },
    },
  },
});

// Update mobile styles
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#f5f8fa', 
  backgroundImage: 'linear-gradient(to bottom, #f5f8fa, #e8f1f8)',
  borderRadius: '12px',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 0,
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100%',
  },
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #0a4d82 100%)',
  color: 'white',
  borderRadius: '12px 12px 0 0',
  marginBottom: 0,
  padding: theme.spacing(3, 4),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
    borderRadius: '8px 8px 0 0',
  },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '0 0 12px 12px',
  paddingTop: '24px',
  paddingBottom: '32px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '0 0 8px 8px',
  },
}));

const OptionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: 12,
  transition: 'all 0.2s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 8,
  },
}));

// Steps for the wizard - removed Property & Other Expenses step
const steps = [
  {
    label: 'Mortgage Details',
    description: 'Enter information about your mortgage.'
  },
  {
    label: 'Other Debts',
    description: 'Enter your other monthly debt payments.'
  },
  {
    label: 'Income',
    description: 'Enter all sources of monthly income.'
  },
  {
    label: 'Results',
    description: 'View your TDS calculation results.'
  }
];

export const TDSCalculatorForm: React.FC = () => {
  const { 
    financialData, 
    result, 
    handleInputChange, 
    calculate, 
    resetForm 
  } = useTDSCalculator();

  const [activeStep, setActiveStep] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  
  // State for optional fields
  const [hasCarPayments, setHasCarPayments] = useState(false);
  const [hasStudentLoans, setHasStudentLoans] = useState(false);
  const [hasCreditCardPayments, setHasCreditCardPayments] = useState(false);
  const [hasOtherLoans, setHasOtherLoans] = useState(false);

  // Use isMobile to apply conditional styling
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      calculate();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    resetForm();
  };

  // Handle checkbox changes for optional fields
  const handleOptionalFieldChange = (field: string, checked: boolean) => {
    // Reset the value when unchecked
    if (!checked) {
      handleInputChange(field as keyof typeof financialData, '0');
    }
    
    switch(field) {
      case 'carPayments':
        setHasCarPayments(checked);
        break;
      case 'studentLoans':
        setHasStudentLoans(checked);
        break;
      case 'creditCardPayments':
        setHasCreditCardPayments(checked);
        break;
      case 'otherLoans':
        setHasOtherLoans(checked);
        break;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Mortgage Details
        return (
          <Box sx={{ mt: 3 }}>
            <Stack spacing={4}>
              <CurrencyInput
                label="Monthly Mortgage Payment"
                value={financialData.mortgagePayment}
                onChange={(value) => handleInputChange('mortgagePayment', value)}
                helperText="Principal and interest combined"
                tooltipText="The total amount you pay monthly for your mortgage (principal + interest)"
              />
              
              <CurrencyInput
                label="Remaining Mortgage Balance"
                value={financialData.mortgageRemaining || 0}
                onChange={(value) => handleInputChange('mortgageRemaining', value)}
                tooltipText="How much is left to pay on your mortgage"
              />
              
              {showMoreInfo && (
                <Fade in={showMoreInfo}>
                  <Box>
                    <CurrencyInput
                      label="Mortgage Interest Rate (%)"
                      value={financialData.mortgageInterestRate || 0}
                      onChange={(value) => handleInputChange('mortgageInterestRate', value)}
                      tooltipText="Your current mortgage interest rate"
                    />
                  </Box>
                </Fade>
              )}
              
              <Button 
                variant="text" 
                color="primary" 
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                sx={{ 
                  alignSelf: 'flex-start',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                {showMoreInfo ? "Show less details" : "Show more details"}
              </Button>
            </Stack>
          </Box>
        );
      
      case 1: // Other Debts (was index 2 before)
        return (
          <Box sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontStyle: 'italic', 
                  mb: 1,
                  padding: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.info.main}`
                }}
              >
                These debt payments are optional. Only check the ones that apply to you.
              </Typography>
              
              <OptionBox>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasCarPayments}
                      onChange={(e) => handleOptionalFieldChange('carPayments', e.target.checked)}
                      sx={{ color: theme.palette.primary.main }}
                      icon={<CheckCircleOutlineIcon sx={{ opacity: 0.6 }} />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      I have car payments
                    </Typography>
                  }
                />
                
                {hasCarPayments && (
                  <Fade in={hasCarPayments}>
                    <Box sx={{ mt: 1, ml: isMobile ? 0 : 4 }}>
                      <CurrencyInput
                        label="Car Payments"
                        value={financialData.carPayments}
                        onChange={(value) => handleInputChange('carPayments', value)}
                        helperText="Total monthly payments for all vehicles"
                        tooltipText="Combined monthly payments for all car loans or leases"
                      />
                    </Box>
                  </Fade>
                )}
              </OptionBox>
              
              <OptionBox>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasStudentLoans}
                      onChange={(e) => handleOptionalFieldChange('studentLoans', e.target.checked)}
                      sx={{ color: theme.palette.primary.main }}
                      icon={<CheckCircleOutlineIcon sx={{ opacity: 0.6 }} />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      I have student loans
                    </Typography>
                  }
                />
                
                {hasStudentLoans && (
                  <Fade in={hasStudentLoans}>
                    <Box sx={{ mt: 1, ml: isMobile ? 0 : 4 }}>
                      <CurrencyInput
                        label="Student Loans"
                        value={financialData.studentLoans}
                        onChange={(value) => handleInputChange('studentLoans', value)}
                        tooltipText="Student loan payments"
                        allowPeriodToggle={true}
                      />
                    </Box>
                  </Fade>
                )}
              </OptionBox>
              
              <OptionBox>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasCreditCardPayments}
                      onChange={(e) => handleOptionalFieldChange('creditCardPayments', e.target.checked)}
                      sx={{ color: theme.palette.primary.main }}
                      icon={<CheckCircleOutlineIcon sx={{ opacity: 0.6 }} />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      I have credit card payments
                    </Typography>
                  }
                />
                
                {hasCreditCardPayments && (
                  <Fade in={hasCreditCardPayments}>
                    <Box sx={{ mt: 1, ml: isMobile ? 0 : 4 }}>
                      <CurrencyInput
                        label="Credit Card Payments"
                        value={financialData.creditCardPayments}
                        onChange={(value) => handleInputChange('creditCardPayments', value)}
                        helperText="Minimum monthly payments"
                        tooltipText="Combined minimum monthly payments for all credit cards"
                      />
                    </Box>
                  </Fade>
                )}
              </OptionBox>
              
              <OptionBox>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasOtherLoans}
                      onChange={(e) => handleOptionalFieldChange('otherLoans', e.target.checked)}
                      sx={{ color: theme.palette.primary.main }}
                      icon={<CheckCircleOutlineIcon sx={{ opacity: 0.6 }} />}
                      checkedIcon={<CheckCircleOutlineIcon />}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      I have other loans
                    </Typography>
                  }
                />
                
                {hasOtherLoans && (
                  <Fade in={hasOtherLoans}>
                    <Box sx={{ mt: 1, ml: isMobile ? 0 : 4 }}>
                      <CurrencyInput
                        label="Other Loans"
                        value={financialData.otherLoans}
                        onChange={(value) => handleInputChange('otherLoans', value)}
                        helperText="Personal loans, lines of credit, etc."
                        tooltipText="Monthly payments for any other loans or debts"
                        allowPeriodToggle={true}
                      />
                    </Box>
                  </Fade>
                )}
              </OptionBox>
            </Stack>
          </Box>
        );
      
      case 2: // Income (was index 3 before)
        return (
          <Box sx={{ mt: 3 }}>
            <Stack spacing={4}>
              <CurrencyInput
                label="Your Gross Income"
                value={financialData.grossIncomeMain}
                onChange={(value) => handleInputChange('grossIncomeMain', value)}
                helperText="Before tax and deductions"
                tooltipText="Your income before taxes and deductions"
                allowPeriodToggle={true}
              />
              
              <CurrencyInput
                label="Spouse's Gross Income"
                value={financialData.grossIncomeSpouse}
                onChange={(value) => handleInputChange('grossIncomeSpouse', value)}
                helperText="If applicable"
                tooltipText="Your spouse's income before taxes (if applicable)"
                allowPeriodToggle={true}
              />
              
              <CurrencyInput
                label="Rental Income"
                value={financialData.grossIncomeRental}
                onChange={(value) => handleInputChange('grossIncomeRental', value)}
                helperText="Gross income from rental properties"
                tooltipText="Income from rental properties before expenses"
                allowPeriodToggle={true}
              />
              
              <CurrencyInput
                label="Other Income"
                value={financialData.otherIncome}
                onChange={(value) => handleInputChange('otherIncome', value)}
                helperText="Investments, pensions, etc."
                tooltipText="Any other regular income sources"
                allowPeriodToggle={true}
              />
            </Stack>
          </Box>
        );
      
      case 3: // Results (was index 4 before)
        return result && (
          <Fade in={true} timeout={800}>
            <Box>
              <ResultsDisplay result={result} />
            </Box>
          </Fade>
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        <HeaderPaper elevation={3} sx={{ mb: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            mb: 1,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
          }}>
            <AccountBalanceIcon sx={{ 
              fontSize: isMobile ? 32 : 36, 
              mr: isMobile ? 0 : 2,
              mb: isMobile ? 1 : 0 
            }} />
            <Typography variant="h4" component="h1" sx={{ 
              fontSize: { xs: '1.3rem', sm: '2.125rem' },
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Canada Greener Homes Loan
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ 
            mb: 3, 
            opacity: 0.9, 
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
          }}>
            TDS Calculator
          </Typography>
          <Typography variant="body1" paragraph sx={{ 
            maxWidth: '100%',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}>
            This calculator helps determine if you qualify for the Canada Greener Homes Loan
            based on the CMHC 39/44 rule. Enter your financial information below.
          </Typography>
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Typography variant="body2" sx={{ 
            opacity: 0.9,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }} paragraph>
            All calculations are performed in your browser. No data is sent to any server.
          </Typography>
        </HeaderPaper>

        <ContentPaper elevation={3} sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stepper 
            activeStep={activeStep} 
            orientation={isMobile ? "vertical" : "vertical"}
            sx={{
              '.MuiStepConnector-line': {
                minHeight: isMobile ? 20 : 40
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    color: activeStep === index ? theme.palette.primary.main : 'inherit'
                  }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      borderLeft: `3px solid ${theme.palette.primary.light}`,
                      pl: 2,
                      py: 1
                    }}
                  >
                    {step.description}
                  </Typography>
                  
                  {renderStepContent(index)}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    mt: 4, 
                    gap: 2,
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    pt: 3
                  }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disableElevation
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        py: { xs: 1.2, sm: 1.5 }, 
                        width: { xs: '100%', sm: 'auto' },
                        order: { xs: 1, sm: 2 },
                        px: { xs: 3, sm: 4 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {index === steps.length - 2 ? (
                        <>Calculate <CalculateIcon fontSize="small" /></>
                      ) : index === steps.length - 1 ? (
                        <>Start Over <RestartAltIcon fontSize="small" /></>
                      ) : (
                        <>Continue <ArrowForwardIcon fontSize="small" /></>
                      )}
                    </Button>
                    
                    {index > 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{ 
                          width: { xs: '100%', sm: 'auto' }, 
                          order: { xs: 2, sm: 1 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                        startIcon={<ArrowBackIcon />}
                      >
                        Back
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length && (
            <Box sx={{ mt: 3 }}>
              <Button 
                onClick={handleReset} 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  py: { xs: 1.2, sm: 1.5 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
                startIcon={<RestartAltIcon />}
              >
                Reset & Start Again
              </Button>
            </Box>
          )}
        </ContentPaper>
      </StyledContainer>
    </ThemeProvider>
  );
}; 