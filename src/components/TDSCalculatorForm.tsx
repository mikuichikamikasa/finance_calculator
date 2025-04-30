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
  FormControlLabel
} from '@mui/material';
import { CurrencyInput } from './CurrencyInput';
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
    label: 'Mortgage Details',
    description: 'Enter information about your mortgage.'
  },
  {
    label: 'Property & Other Expenses',
    description: 'Enter any other property-related expenses (if applicable).'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  
  // State for optional fields
  const [hasPropertyTax, setHasPropertyTax] = useState(false);
  const [hasCondoFees, setHasCondoFees] = useState(false);
  const [hasHomeInsurance, setHasHomeInsurance] = useState(false);
  const [hasHeatingCosts, setHasHeatingCosts] = useState(false);
  const [hasCarPayments, setHasCarPayments] = useState(false);
  const [hasStudentLoans, setHasStudentLoans] = useState(false);
  const [hasCreditCardPayments, setHasCreditCardPayments] = useState(false);
  const [hasOtherLoans, setHasOtherLoans] = useState(false);

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
      case 'propertyTax':
        setHasPropertyTax(checked);
        break;
      case 'condoFees':
        setHasCondoFees(checked);
        break;
      case 'homeInsurance':
        setHasHomeInsurance(checked);
        break;
      case 'heatingCosts':
        setHasHeatingCosts(checked);
        break;
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
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
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
                <CurrencyInput
                  label="Mortgage Interest Rate (%)"
                  value={financialData.mortgageInterestRate || 0}
                  onChange={(value) => handleInputChange('mortgageInterestRate', value)}
                  tooltipText="Your current mortgage interest rate"
                />
              )}
              
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
      
      case 1: // Property & Other Expenses
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                These expenses are optional. Only check the ones that apply to you.
              </Typography>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasPropertyTax}
                      onChange={(e) => handleOptionalFieldChange('propertyTax', e.target.checked)}
                    />
                  }
                  label="I pay property tax"
                />
                
                {hasPropertyTax && (
                  <CurrencyInput
                    label="Property Tax"
                    value={financialData.propertyTax}
                    onChange={(value) => handleInputChange('propertyTax', value)}
                    tooltipText="Enter your property tax amount"
                    helperText="The calculator will convert to monthly if you enter yearly"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasCondoFees}
                      onChange={(e) => handleOptionalFieldChange('condoFees', e.target.checked)}
                    />
                  }
                  label="I pay condo/strata fees"
                />
                
                {hasCondoFees && (
                  <CurrencyInput
                    label="Condo/Strata Fees"
                    value={financialData.condoFees}
                    onChange={(value) => handleInputChange('condoFees', value)}
                    tooltipText="Your maintenance fees for your property"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasHomeInsurance}
                      onChange={(e) => handleOptionalFieldChange('homeInsurance', e.target.checked)}
                    />
                  }
                  label="I pay home insurance"
                />
                
                {hasHomeInsurance && (
                  <CurrencyInput
                    label="Home Insurance"
                    value={financialData.homeInsurance}
                    onChange={(value) => handleInputChange('homeInsurance', value)}
                    tooltipText="Your home insurance premium"
                    helperText="The calculator will convert to monthly if you enter yearly"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasHeatingCosts}
                      onChange={(e) => handleOptionalFieldChange('heatingCosts', e.target.checked)}
                    />
                  }
                  label="I pay for heating"
                />
                
                {hasHeatingCosts && (
                  <CurrencyInput
                    label="Monthly Heating Costs"
                    value={financialData.heatingCosts}
                    onChange={(value) => handleInputChange('heatingCosts', value)}
                    tooltipText="Average monthly heating costs"
                    helperText="Estimate your average monthly heating costs"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        );
      
      case 2: // Other Debts
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                These debt payments are optional. Only check the ones that apply to you.
              </Typography>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasCarPayments}
                      onChange={(e) => handleOptionalFieldChange('carPayments', e.target.checked)}
                    />
                  }
                  label="I have car payments"
                />
                
                {hasCarPayments && (
                  <CurrencyInput
                    label="Car Payments"
                    value={financialData.carPayments}
                    onChange={(value) => handleInputChange('carPayments', value)}
                    helperText="Total monthly payments for all vehicles"
                    tooltipText="Combined monthly payments for all car loans or leases"
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasStudentLoans}
                      onChange={(e) => handleOptionalFieldChange('studentLoans', e.target.checked)}
                    />
                  }
                  label="I have student loans"
                />
                
                {hasStudentLoans && (
                  <CurrencyInput
                    label="Student Loans"
                    value={financialData.studentLoans}
                    onChange={(value) => handleInputChange('studentLoans', value)}
                    tooltipText="Student loan payments"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasCreditCardPayments}
                      onChange={(e) => handleOptionalFieldChange('creditCardPayments', e.target.checked)}
                    />
                  }
                  label="I have credit card payments"
                />
                
                {hasCreditCardPayments && (
                  <CurrencyInput
                    label="Credit Card Payments"
                    value={financialData.creditCardPayments}
                    onChange={(value) => handleInputChange('creditCardPayments', value)}
                    helperText="Minimum monthly payments"
                    tooltipText="Combined minimum monthly payments for all credit cards"
                  />
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={hasOtherLoans}
                      onChange={(e) => handleOptionalFieldChange('otherLoans', e.target.checked)}
                    />
                  }
                  label="I have other loans"
                />
                
                {hasOtherLoans && (
                  <CurrencyInput
                    label="Other Loans"
                    value={financialData.otherLoans}
                    onChange={(value) => handleInputChange('otherLoans', value)}
                    helperText="Personal loans, lines of credit, etc."
                    tooltipText="Monthly payments for any other loans or debts"
                    allowPeriodToggle={true}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        );
      
      case 3: // Income
        return (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
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
      
      case 4: // Results
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