import React from 'react';
import { Paper, Typography, Box, Divider, Alert, Stack, styled } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TDSResult } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsDisplayProps {
  result: TDSResult;
}

const ResultItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const {
    tdsRatio,
    gdsRatio = 0,
    isQualified,
    shortfall,
    totalMonthlyIncome,
    totalMonthlyDebt,
    tdsCeiling,
    totalHousingCosts = 0,
    totalOtherDebts = 0
  } = result;

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Bar chart data for comparing TDS to ceiling
  const barChartData = {
    labels: ['Your Debt Service', 'Maximum Allowed (44%)'],
    datasets: [
      {
        label: 'Monthly Debt vs. Maximum Allowed',
        data: [totalMonthlyDebt, tdsCeiling],
        backgroundColor: [
          isQualified ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          isQualified ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'TDS Comparison',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
  };

  // Doughnut chart for debt breakdown
  const doughnutChartData = {
    labels: ['Housing Costs', 'Other Debts'],
    datasets: [
      {
        data: [totalHousingCosts, totalOtherDebts],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Debt Breakdown',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = formatCurrency(context.raw);
            const percentage = formatPercentage(context.raw / totalMonthlyDebt);
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    },
  };

  return (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        TDS Calculation Results
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          mb: 3 
        }}
      >
        <Box sx={{ flex: 1, height: { xs: '250px', sm: '300px' } }}>
          <Bar data={barChartData} options={barChartOptions} />
        </Box>
        <Box sx={{ flex: 1, height: { xs: '250px', sm: '300px' } }}>
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        </Box>
      </Box>

      <Alert 
        severity={isQualified ? "success" : "warning"}
        variant="filled"
        sx={{ 
          fontSize: '16px', 
          py: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
          {isQualified ? "You Qualify!" : "You Don't Qualify Yet"}
        </Typography>
        
        {isQualified ? (
          <Typography variant="body1">
            Congratulations! Your TDS ratio of {formatPercentage(tdsRatio)} is below the maximum allowed 44.00%.
            You meet the debt-capacity test for the Canada Greener Homes Loan.
          </Typography>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              Your TDS ratio of {formatPercentage(tdsRatio)} exceeds the maximum allowed 44.00%.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              To qualify, you need to either:
            </Typography>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>
                <Typography variant="body1">
                  Increase your monthly income by at least {formatCurrency(shortfall)}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Reduce your monthly debt payments by at least {formatCurrency(shortfall)}
                </Typography>
              </li>
            </ul>
          </>
        )}
      </Alert>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          <ResultItem>
            <Typography variant="body2" color="text.secondary">
              Total Monthly Income
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(totalMonthlyIncome)}
            </Typography>
          </ResultItem>

          <ResultItem>
            <Typography variant="body2" color="text.secondary">
              Total Monthly Debt
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(totalMonthlyDebt)}
            </Typography>
            <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Housing: {formatCurrency(totalHousingCosts)}
              </Typography>
              <Typography variant="body2">
                Other Debts: {formatCurrency(totalOtherDebts)}
              </Typography>
            </Box>
          </ResultItem>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <ResultItem sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Your TDS Ratio
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: tdsRatio <= 44 ? 'success.main' : 'error.main'
                }}
              >
                {formatPercentage(tdsRatio)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Maximum Allowed: 44.00%
              </Typography>
            </ResultItem>

            <ResultItem sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Your GDS Ratio
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: gdsRatio <= 39 ? 'success.main' : 'error.main'
                }}
              >
                {formatPercentage(gdsRatio)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Maximum Allowed: 39.00%
              </Typography>
            </ResultItem>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}; 