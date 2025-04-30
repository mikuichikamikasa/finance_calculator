# Canada Greener Homes Loan TDS Calculator

A client-facing Total Debt Service (TDS) calculator that helps Canadians determine if they qualify for the Canada Greener Homes Loan based on the CMHC 39/44 rule.

## Live Demo

Once deployed, the calculator will be available online.

## Features

- Calculate your Total Debt Service (TDS) ratio based on CMHC's 44% rule
- Determine eligibility for the Canada Greener Homes Loan
- Get specific feedback on shortfall if you don't qualify
- Visual representation of your debt load compared to the maximum allowed
- All calculations performed client-side with no data sent to any server
- Responsive design works on desktop and mobile devices

## What Is TDS?

The Total Debt Service (TDS) ratio is a calculation used by mortgage lenders to determine if you can afford your housing costs plus other debts. For the Canada Greener Homes Loan:

- TDS = (All monthly debt obligations / Gross monthly income) * 100
- Your TDS must be 44% or less to qualify

## How To Use

1. Enter your mortgage payment details (mortgage payment, property tax, heating, condo fees)
2. Add any other property-related expenses (home insurance)
3. Include other monthly debt payments (car loans, student loans, credit cards, etc.)
4. Enter all sources of gross monthly income (yours, spouse, rental income, etc.)
5. Click "Calculate TDS Ratio" to see if you qualify

## Privacy

This calculator runs entirely in your browser. No personal or financial information is sent to any server, ensuring your data remains private.

## Development

This project was built with:

- React
- TypeScript
- Material UI
- Chart.js

### Running Locally

```bash
# Clone the repository
git clone https://github.com/[username]/tds-calculator.git

# Navigate to the project directory
cd tds-calculator

# Install dependencies
npm install

# Start the development server
npm start
```

### Deployment

This project is configured to deploy to GitHub Pages:

```bash
# Deploy to GitHub Pages
npm run deploy
```

## License

This project is open source and available under the MIT License.

## Disclaimer

This calculator is provided for informational purposes only. While we strive for accuracy, you should consult with a mortgage professional for a final determination of your eligibility for the Canada Greener Homes Loan.
