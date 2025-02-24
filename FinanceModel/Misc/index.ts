import axios from "axios";
// If you're using dotenv, uncomment these lines:
import * as dotenv from "dotenv";
dotenv.config();

async function callFriendliAI() {
  // 1. Retrieve environment variables (or use fallback values for demo)
  const FRIENDLI_TOKEN = ''
  const ENDPOINT_ID = ''

  // Example financial data object:
  const financialData = {
    totalIncome: 5000,
    totalExpenses: 3000,
    currentDebt: 10000,
    currentSavings: 2000,
    debts: [
      { type: "Credit Card", amount: 6000, interestRate: 18.5 },
      { type: "Car Loan", amount: 4000, interestRate: 4.5 }
    ],
    // ... Add more fields as needed
  };

  // 2. Prepare the request body and headers
  const url = "https://api.friendli.ai/dedicated/v1/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FRIENDLI_TOKEN}`
  };

  const data = {
    model: ENDPOINT_ID,
    prompt: `You are a seasoned financial advisor with expertise in personal finance and wealth management.
Generate a detailed, data-driven financial report using the following computed financial analysis.
Use the exact numbers and computed values to provide specific, actionable recommendations.
Ensure that your report includes:
1. An Introduction summarizing the user's financial situation (total income, expenses, debt, current savings).
2. A Debt Repayment Plan detailing each debt, extra payments, estimated time to become debt-free, and total interest saved.
3. A Current Savings Status section that explains current savings and recommended monthly savings.
4. Future Savings Projections and Investment Recommendations with precise 5-year growth projections.
5. A Conclusion that recaps the key recommendations and provides clear next steps.

Financial Analysis Data:
${JSON.stringify(financialData, null, 2)}

Please produce a comprehensive report of about 500 words that includes exact values, percentage splits, and clear, step-by-step recommendations.`,
    min_tokens: 20,
    max_tokens: 30,
    top_k: 32,
    top_p: 0.8,
    n: 3,
    no_repeat_ngram: 3,
    ngram_repetition_penalty: 1.75
  };

  try {
    // 3. Send the POST request
    const response = await axios.post(url, data, { headers });

    // 4. Log the raw response
    console.log("Friendli AI response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    // 5. Handle errors
    console.error("Error calling Friendli AI:", error?.message || error);
  }
}

// Run the function
callFriendliAI();
