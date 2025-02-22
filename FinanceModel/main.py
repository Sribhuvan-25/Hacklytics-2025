import json
from FinanceModule import Debt, simulate_financial_plan
from FinanceReport import generate_financial_report

def main():

    debts = [
        Debt("Credit Card", 5000, 0.18, 100),
        Debt("Car Loan", 10000, 0.05, 200)
    ]
    income = 5000
    non_debt_expenses = 3000
    initial_savings_balance = 2000
    strategy = 'avalanche'
    risk_tolerance = 'medium'
    
    try:
        financial_data = simulate_financial_plan(debts, income, non_debt_expenses, initial_savings_balance, 
                                                risk_tolerance=risk_tolerance, strategy=strategy)
        print("\nFinancial Plan Data:")
        print(json.dumps(financial_data, indent=2))
        
        report = generate_financial_report(financial_data)
        print("\nGenerated Financial Report:")
        print(report)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()