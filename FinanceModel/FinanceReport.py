from langchain_ollama import OllamaLLM
import json
def generate_financial_report_llama(financial_data):
    """
    Generate a detailed financial report using a local LLaMA model via LangChain's LlamaCpp.
    The prompt includes the full financial analysis data to allow the model to generate an in-depth report.
    """

    prompt = f"""
        You are a seasoned financial advisor with expertise in personal finance and wealth management.
        Generate a detailed, data-driven financial report using the following computed financial analysis.
        Use the exact numbers and computed values to provide specific, actionable recommendations.
        Ensure that your report includes:
        1. An Introduction summarizing the user's financial situation (total income, expenses, debt, current savings).
        2. A Debt Repayment Plan detailing each debt, extra payments, estimated time to become debt-free, and total interest saved.
        3. A Current Savings Status section that explains current savings and recommended monthly savings.
        4. Future Savings Projections and Investment Recommendations with precise 5-year growth projections.
        5. A Conclusion that recaps the key recommendations and provides clear next steps.

        Financial Analysis Data:
        {json.dumps(financial_data, indent=2)}

        Please produce a comprehensive report of about 500 words that includes exact values, percentage splits, and clear, step-by-step recommendations.
    """
    
    combined_prompt = """
        You are a financial advisor specializing in debt reduction and savings growth. Based on the provided financial data, generate a comprehensive, structured report that includes the following:

        - A summary of the client's total monthly income, categorized expenses (distinguishing between needs and wants), and outstanding debt details (including type, balance, APR, and monthly payment).
        - A recommended debt repayment strategy (choose either Avalanche or Snowball) with an estimated payoff timeline and the potential interest savings.
        - An analysis of the current budget with suggestions for reducing discretionary spending and reallocating funds to optimize debt repayment.
        - A detailed savings plan that projects 5-year growth under different annual return scenarios (5%, 7%, and 10%), and recommendations for post-debt investment strategies (e.g., low-cost index funds, bonds, high-yield savings).
        - A step-by-step 12-month action plan outlining key steps to achieve debt clearance, including an estimated debt-free date and projected savings balance after debt is cleared.

        For guidance, consider the following structure:

        1. **Introduction: Financial Overview**
        - Total Monthly Income
        - Total Expenses (Needs vs. Wants)
        - Total Debt (Debt Type, Balance, APR, Monthly Payment)
        - Current Savings

        2. **Debt Analysis & Repayment Plan**
        - Detailed Debt Breakdown
        - Optimized Repayment Strategy (Avalanche/Snowball)
        - Estimated Debt-Free Timeline
        - Projected Interest Savings

        3. **Budget & Expense Optimization**
        - Analysis of Needs vs. Wants
        - Recommended Budget Adjustments
        - Suggested Fund Reallocation for Debt Repayment

        4. **Savings & Future Financial Projections**
        - Current Savings & Monthly Contributions
        - 5-Year Savings Growth Projections (at 5%, 7%, and 10% returns)
        - Post-Debt Investment Recommendations

        5. **Action Plan & Final Recommendations**
        - Step-by-Step 12-Month Action Plan
        - Estimated Debt-Free Date
        - Projected Savings Post-Debt
        - Next Steps for Financial Stability and Wealth-Building

        Using this combined prompt, generate a report that clearly addresses each of these points with sufficient detail.
    """

    llm = OllamaLLM(model="llama3.2", prompt=combined_prompt)
    report = llm(combined_prompt)
    return report

if __name__ == "__main__":
    financial_data = {
        "income": [
            {"title": "Job", "amount": 5000},
            {"title": "Side Hustle", "amount": 1000},
            {"title": "Investment", "amount": 500}
        ],
        "debt": [
            {"name": "Credit Card", "total_amount": 5000, "monthly_payment": 100, "apr": 0.18, "tenure": 60},
            {"name": "Car Loan", "total_amount": 10000, "monthly_payment": 200, "apr": 0.05, "tenure": 60}
        ],
        "expenses": {
            "needs": [
                {"title": "Rent", "amount": 1500},
                {"title": "Utilities", "amount": 300}
            ],  
            "wants": [
                {"title": "Dining Out", "amount": 200},
                {"title": "Entertainment", "amount": 150}
            ]
        },
        "savings": 2000
    }

    report = generate_financial_report_llama(financial_data)
    print(report)
