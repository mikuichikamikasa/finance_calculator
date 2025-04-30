import { useState } from 'react';
import { FinancialData, TDSResult } from '../types';
import { calculateTDS } from '../utils/tdsCalculator';

// Default values for the form
const defaultFinancialData: FinancialData = {
  mortgagePayment: 0,
  propertyTax: 0,
  heatingCosts: 0,
  condoFees: 0,
  homeInsurance: 0,
  carPayments: 0,
  studentLoans: 0,
  creditCardPayments: 0,
  otherLoans: 0,
  grossIncomeMain: 0,
  grossIncomeSpouse: 0,
  grossIncomeRental: 0,
  otherIncome: 0
};

export const useTDSCalculator = () => {
  const [financialData, setFinancialData] = useState<FinancialData>(defaultFinancialData);
  const [result, setResult] = useState<TDSResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof FinancialData, value: string) => {
    // Convert string value to number
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setFinancialData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Reset form to default values
  const resetForm = () => {
    setFinancialData(defaultFinancialData);
    setResult(null);
    setHasCalculated(false);
  };

  // Calculate TDS ratio
  const calculate = () => {
    const tdsResult = calculateTDS(financialData);
    setResult(tdsResult);
    setHasCalculated(true);
    return tdsResult;
  };

  return {
    financialData,
    result,
    hasCalculated,
    handleInputChange,
    calculate,
    resetForm
  };
}; 