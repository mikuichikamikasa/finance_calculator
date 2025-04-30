import { FinancialData, TDSResult } from '../types';

const TDS_CEILING_PERCENTAGE = 44; // 44% maximum TDS ratio for CMHC
const GDS_CEILING_PERCENTAGE = 39; // 39% maximum GDS ratio for CMHC

/**
 * Calculates the Total Debt Service (TDS) ratio based on the CMHC 39/44 rule
 * TDS = (All monthly debt obligations / Gross monthly income) * 100
 * GDS = (Housing costs / Gross monthly income) * 100
 */
export const calculateTDS = (data: FinancialData): TDSResult => {
  // Calculate total monthly housing costs
  const housingCosts = 
    data.mortgagePayment + 
    data.propertyTax + 
    data.heatingCosts + 
    data.condoFees +
    data.homeInsurance;
  
  // Calculate other monthly debt payments
  const otherDebts = 
    data.carPayments + 
    data.studentLoans + 
    data.creditCardPayments + 
    data.otherLoans;
  
  // Calculate total monthly debt payments
  const totalMonthlyDebt = housingCosts + otherDebts;
  
  // Calculate total monthly income
  const totalMonthlyIncome = 
    data.grossIncomeMain + 
    data.grossIncomeSpouse + 
    data.grossIncomeRental + 
    data.otherIncome;
  
  // Calculate TDS ratio
  const tdsRatio = totalMonthlyIncome > 0 
    ? (totalMonthlyDebt / totalMonthlyIncome) * 100 
    : 100;

  // Calculate GDS ratio
  const gdsRatio = totalMonthlyIncome > 0
    ? (housingCosts / totalMonthlyIncome) * 100
    : 100;

  // Calculate TDS ceiling in dollars
  const tdsCeiling = (totalMonthlyIncome * TDS_CEILING_PERCENTAGE) / 100;
  
  // Check if both TDS and GDS are within the acceptable limits
  const isQualified = tdsRatio <= TDS_CEILING_PERCENTAGE && gdsRatio <= GDS_CEILING_PERCENTAGE;
  
  // Calculate how much more income is needed or debt must be reduced
  const shortfall = isQualified 
    ? 0 
    : totalMonthlyDebt - tdsCeiling;
  
  return {
    tdsRatio,
    gdsRatio,
    isQualified,
    shortfall,
    totalMonthlyIncome,
    totalMonthlyDebt,
    tdsCeiling,
    totalHousingCosts: housingCosts,
    totalOtherDebts: otherDebts
  };
}; 