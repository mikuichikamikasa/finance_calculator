export interface DebtDetails {
  monthlyPayment: number;
  remainingBalance?: number;
  interestRate?: number;
  paymentTerm?: number; // in months
}

export interface FinancialData {
  // Mortgage details
  mortgagePayment: number;
  mortgageRemaining?: number;
  mortgageInterestRate?: number;
  mortgageTerm?: number;
  
  // Property-related expenses
  propertyTax: number;
  heatingCosts: number;
  condoFees: number;
  homeInsurance: number;
  
  // Other monthly debts
  carPayments: number;
  carLoanDetails?: DebtDetails;
  
  studentLoans: number;
  studentLoanDetails?: DebtDetails;
  
  creditCardPayments: number;
  creditCardDetails?: DebtDetails;
  
  otherLoans: number;
  otherLoanDetails?: DebtDetails;
  
  // Income sources
  grossIncomeMain: number;
  grossIncomeSpouse: number;
  grossIncomeRental: number;
  otherIncome: number;
}

export interface TDSResult {
  tdsRatio: number;
  gdsRatio?: number; // Gross Debt Service ratio
  isQualified: boolean;
  shortfall: number;
  totalMonthlyIncome: number;
  totalMonthlyDebt: number;
  tdsCeiling: number;
  totalHousingCosts?: number;
  totalOtherDebts?: number;
} 