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
  styled
} from '@mui/material';
import { CurrencyInput } from './CurrencyInput';
import { FormSection } from './FormSection';
import { ResultsDisplay } from './ResultsDisplay';
import { useTDSCalculator } from '../hooks/useTDSCalculator';

const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Steps for the wizard
const steps = [
  {
    label: 'Mortgage & Property Details',
    description: 'Enter information about your mortgage payment and property expenses.'
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
    hasCalculated, 
    handleInputChange, 
    calculate, 
    resetForm 
  } = useTDSCalculator();

  const [activeStep, setActiveStep] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <CurrencyInput
                label="Monthly Mortgage Payment"
                value={financialData.mortgagePayment}
                onChange={(value) => handleInputChange('mortgagePayment', value)}
                helperText="Principal and interest"
                tooltipText="The amount you pay monthly for your mortgage (principal + interest)"
              />
              
              {showMoreInfo && (
                <>
                  <CurrencyInput
                    label="Mortgage Remaining Balance"
                    value={financialData.mortgageRemaining || 0}
                    onChange={(value) => handleInputChange('mortgageRemaining', value)}
                    tooltipText="The remaining balance on your mortgage"
                  />
                  
                  <CurrencyInput
                    label="Mortgage Interest Rate (%)"
                    value={financialData.mortgageInterestRate || 0}
                    onChange={(value) => handleInputChange('mortgageInterestRate', value)}
                    tooltipText="Your current mortgage interest rate"
                  />
                </>
              )}
              
              <CurrencyInput
                label="Monthly Property Tax"
                value={financialData.propertyTax}
                onChange={(value) => handleInputChange('propertyTax', value)}
                tooltipText="Monthly property tax amount (divide annual amount by 12)"
              />
              
              <CurrencyInput
                label="Monthly Heating Costs"
                value={financialData.heatingCosts}
                onChange={(value) => handleInputChange('heatingCosts', value)}
                tooltipText="Average monthly heating costs"
              />
              
              <CurrencyInput
                label="Monthly Condo Fees"
                value={financialData.condoFees}
                onChange={(value) => handleInputChange('condoFees', value)}
                helperText="If applicable"
                tooltipText="Monthly condo or strata fees if applicable"
              />
              
              <CurrencyInput
                label="Monthly Home Insurance"
                value={financialData.homeInsurance}
                onChange={(value) => handleInputChange('homeInsurance', value)}
                tooltipText="Monthly home insurance premium"
              />
              
              <Button 
                variant="text" 
                color="primary" 
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                sx={{ alignSelf: 'flex-start' }}
              >
                {showMoreInfo ? "Show less details" : "Show more details"}
              </Button>
            </Stack>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <CurrencyInput
                label="Car Payments"
                value={financialData.carPayments}
                onChange={(value) => handleInputChange('carPayments', value)}
                helperText="Total monthly payments for all vehicles"
                tooltipText="Combined monthly payments for all car loans or leases"
              />
              
              <CurrencyInput
                label="Student Loans"
                value={financialData.studentLoans}
                onChange={(value) => handleInputChange('studentLoans', value)}
                tooltipText="Monthly student loan payments"
              />
              
              <CurrencyInput
                label="Credit Card Payments"
                value={financialData.creditCardPayments}
                onChange={(value) => handleInputChange('creditCardPayments', value)}
                helperText="Minimum monthly payments"
                tooltipText="Combined minimum monthly payments for all credit cards"
              />
              
              <CurrencyInput
                label="Other Loans"
                value={financialData.otherLoans}
                onChange={(value) => handleInputChange('otherLoans', value)}
                helperText="Personal loans, lines of credit, etc."
                tooltipText="Monthly payments for any other loans or debts"
              />
            </Stack>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <CurrencyInput
                label="Your Gross Monthly Income"
                value={financialData.grossIncomeMain}
                onChange={(value) => handleInputChange('grossIncomeMain', value)}
                helperText="Before tax and deductions"
                tooltipText="Your monthly income before taxes and deductions"
              />
              
              <CurrencyInput
                label="Spouse's Gross Monthly Income"
                value={financialData.grossIncomeSpouse}
                onChange={(value) => handleInputChange('grossIncomeSpouse', value)}
                helperText="If applicable"
                tooltipText="Your spouse's monthly income before taxes (if applicable)"
              />
              
              <CurrencyInput
                label="Rental Income"
                value={financialData.grossIncomeRental}
                onChange={(value) => handleInputChange('grossIncomeRental', value)}
                helperText="Gross monthly income from rental properties"
                tooltipText="Monthly income from rental properties before expenses"
              />
              
              <CurrencyInput
                label="Other Income"
                value={financialData.otherIncome}
                onChange={(value) => handleInputChange('otherIncome', value)}
                helperText="Investments, pensions, etc."
                tooltipText="Any other regular monthly income sources"
              />
            </Stack>
          </Box>
        );
      
      case 3:
        return result && (
          <ResultsDisplay result={result} />
        );
      
      default:
        return null;
    }
  };

  return (
    <StyledContainer maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} gutterBottom>
          Canada Greener Homes Loan: TDS Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          This calculator helps determine if you qualify for the Canada Greener Homes Loan
          based on the CMHC 39/44 rule. Enter your financial information below.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          All calculations are performed in your browser. No data is sent to any server.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                
                {renderStepContent(index)}
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 3, gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ 
                      fontSize: '1rem', 
                      py: 1.5, 
                      width: { xs: '100%', sm: 'auto' },
                      order: { xs: 1, sm: 2 }
                    }}
                  >
                    {index === steps.length - 2 ? 'Calculate' : index === steps.length - 1 ? 'Start Over' : 'Continue'}
                  </Button>
                  
                  {index > 0 && (
                    <Button
                      onClick={handleBack}
                      sx={{ width: { xs: '100%', sm: 'auto' }, order: { xs: 2, sm: 1 } }}
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
            <Button onClick={handleReset} variant="outlined" fullWidth sx={{ py: 1.5 }}>
              Reset & Start Again
            </Button>
          </Box>
        )}
      </Paper>
    </StyledContainer>
  );
}; 