import copy
import random

class Debt:
    def __init__(self, name, balance, interest_rate, minimum_payment):
        self.name = name
        self.balance = balance
        self.interest_rate = interest_rate  # Annual rate, e.g., 0.18 for 18%
        self.minimum_payment = minimum_payment

def calculate_consolidated_loan_payment(total_balance, new_interest_rate, term_months):
    """Calculate monthly payment for a consolidated loan using the loan amortization formula."""
    monthly_rate = new_interest_rate / 12
    payment = total_balance * (monthly_rate * (1 + monthly_rate) ** term_months) / ((1 + monthly_rate) ** term_months - 1)
    return payment

def simulate_savings_growth(savings, cash_flow, interest_rate, months, risk_factor='low'):
    """Simulate savings growth with compound interest, adjusted for risk volatility."""
    monthly_rate = interest_rate / 12
    for _ in range(months):
        if risk_factor == 'high':
            adjusted_rate = monthly_rate * (1 + random.uniform(-0.2, 0.2))
        else:
            adjusted_rate = monthly_rate
        savings += savings * adjusted_rate + cash_flow
    return savings

def simulate_financial_plan(debts, income, non_debt_expenses, initial_savings_balance, 
                           risk_tolerance='medium', savings_percentage=0.2, 
                           savings_options={'savings_account': 0.03, 'stock_market': 0.07, 'aggressive_stocks': 0.10}, 
                           strategy='avalanche', consolidation_rate=0.08, consolidation_term=60):
    """
    Simulate debt repayment and savings maximization with risk-based investment options.

    Args:
        debts: List of Debt objects (can be empty for savings-only case)
        income: Monthly income
        non_debt_expenses: Monthly expenses excluding debt payments
        initial_savings_balance: Initial savings balance
        risk_tolerance: 'low', 'medium', 'high' (affects investment choice and volatility)
        savings_percentage: Fraction of cash flow to save during debt repayment (default 20%)
        savings_options: Dict of investment types and annual interest rates
        strategy: 'avalanche', 'snowball', 'consolidation', 'high_minimum', 'savings_max'
        consolidation_rate: Interest rate for debt consolidation (default 8%)
        consolidation_term: Term in months for consolidation loan (default 60 months)

    Returns:
        dict: Structured results for LLM processing with descriptive keys and formatted values
    """
    # Make a deep copy of the debts list to avoid modifying the original list
    debts = [copy.copy(d) for d in debts]
    
    months = 0
    savings_balance = initial_savings_balance
    total_interest_paid = 0
    
    # Map risk tolerance to investment option and risk factor
    risk_map = {
        'low': ('savings_account', 'low'),
        'medium': ('stock_market', 'medium'),
        'high': ('aggressive_stocks', 'high')
    }
    investment_type, risk_factor = risk_map[risk_tolerance]
    savings_interest_rate = savings_options[investment_type]
    monthly_savings_interest = savings_interest_rate / 12
    
    # Calculate initial savings amount based on percentage of income
    monthly_savings_amount = income * savings_percentage
    
    # Handle savings-only case if no debts or strategy is 'savings_max'
    if not debts or strategy == 'savings_max':
        cash_flow = income - non_debt_expenses
        if cash_flow < monthly_savings_amount:
            monthly_savings_amount = cash_flow  # Adjust to max available
        
        # Project savings for 5 years (60 months) with different options
        post_debt_savings = {}
        for option, rate in savings_options.items():
            risk = risk_map['low'][1] if option == 'savings_account' else (risk_map['medium'][1] if option == 'stock_market' else risk_map['high'][1])
            post_debt_savings[option.replace('_', ' ').title()] = f"${simulate_savings_growth(initial_savings_balance, cash_flow, rate, 60, risk):.2f}"
        
        return {
            "Financial Plan": {
                "Strategy Used": strategy.capitalize(),
                "Risk Tolerance": risk_tolerance.capitalize(),
                "Debt Repayment Details": {
                    "Months to Debt-Free": "0 months",
                    "Total Interest Paid": "$0.00"
                },
                "Savings Details": {
                    "Initial Savings Balance": f"${initial_savings_balance:.2f}",
                    "Monthly Savings Allocation": f"${monthly_savings_amount:.2f}",
                    "Savings at Debt-Free": f"${initial_savings_balance:.2f}"
                },
                "Savings Projections": {
                    "5-Year Post-Debt Savings": post_debt_savings
                }
            }
        }
    
    # Debt repayment simulation based on strategy
    if strategy == 'consolidation':
        total_balance = sum(d.balance for d in debts)
        monthly_payment = calculate_consolidated_loan_payment(total_balance, consolidation_rate, consolidation_term)
        remaining_balance = total_balance
        monthly_rate = consolidation_rate / 12
        
        while remaining_balance > 0 and months < consolidation_term:
            interest = remaining_balance * monthly_rate
            total_interest_paid += interest
            remaining_balance += interest - monthly_payment
            if remaining_balance < 0:
                remaining_balance = 0
            
            cash_flow = income - non_debt_expenses - monthly_payment
            monthly_savings_amount = min(cash_flow * savings_percentage, cash_flow)
            savings_balance += savings_balance * monthly_savings_interest + monthly_savings_amount
            months += 1
        
        if remaining_balance > 0:
            raise ValueError("Consolidation term too short to pay off consolidated debt.")
    
    elif strategy == 'high_minimum':
        while debts:
            total_minimum_payments = sum(max(d.minimum_payment, d.balance * 0.05) for d in debts)
            cash_flow = income - non_debt_expenses - total_minimum_payments
            monthly_savings_amount = min(cash_flow * savings_percentage, cash_flow)
            extra_debt_payment = cash_flow - monthly_savings_amount
            
            if extra_debt_payment < 0:
                raise ValueError("Insufficient cash flow for high minimum payments and savings.")
            
            for d in debts:
                interest = d.balance * (d.interest_rate / 12)
                d.balance += interest
                total_interest_paid += interest
                d.balance -= max(d.minimum_payment, d.balance * 0.05)
            
            if debts and extra_debt_payment > 0:
                target_debt = min(debts, key=lambda d: d.balance)
                target_debt.balance -= extra_debt_payment
            
            savings_balance += savings_balance * monthly_savings_interest + monthly_savings_amount
            debts = [d for d in debts if d.balance > 0]
            months += 1
    
    else:  # 'avalanche' or 'snowball'
        while debts:
            total_minimum_payments = sum(d.minimum_payment for d in debts)
            cash_flow = income - non_debt_expenses - total_minimum_payments
            monthly_savings_amount = min(cash_flow * savings_percentage, cash_flow)
            extra_debt_payment = cash_flow - monthly_savings_amount
            
            if extra_debt_payment < 0:
                raise ValueError("Insufficient cash flow to cover savings and debt payments.")
            
            for d in debts:
                interest = d.balance * (d.interest_rate / 12)
                d.balance += interest
                total_interest_paid += interest
                d.balance -= d.minimum_payment
            
            target_debt = (max(debts, key=lambda d: d.interest_rate) if strategy == 'avalanche' 
                          else min(debts, key=lambda d: d.balance)) if debts else None
            
            if target_debt and extra_debt_payment > 0:
                target_debt.balance -= extra_debt_payment
            
            savings_balance += savings_balance * monthly_savings_interest + monthly_savings_amount
            debts = [d for d in debts if d.balance > 0]
            months += 1
    
    # Post-debt savings projection: 5 years (60 months) after debt-free
    post_debt_cash_flow = income - non_debt_expenses
    post_debt_savings = {}
    for option, rate in savings_options.items():
        risk = risk_map['low'][1] if option == 'savings_account' else (risk_map['medium'][1] if option == 'stock_market' else risk_map['high'][1])
        post_debt_savings[option.replace('_', ' ').title()] = f"${simulate_savings_growth(savings_balance, post_debt_cash_flow, rate, 60, risk):.2f}"
    
    return {
        "Financial Plan": {
            "Strategy Used": strategy.capitalize(),
            "Risk Tolerance": risk_tolerance.capitalize(),
            "Debt Repayment Details": {
                "Months to Debt-Free": f"{months} months",
                "Total Interest Paid": f"${total_interest_paid:.2f}"
            },
            "Savings Details": {
                "Initial Savings Balance": f"${initial_savings_balance:.2f}",
                "Monthly Savings Allocation": f"${monthly_savings_amount:.2f}",
                "Savings at Debt-Free": f"${savings_balance:.2f}"
            },
            "Savings Projections": {
                "5-Year Post-Debt Savings": post_debt_savings
            }
        }
    }

# Testing the module
# if __name__ == "__main__":
#     debts = [
#         Debt("Credit Card", 5000, 0.18, 100),
#         Debt("Car Loan", 10000, 0.05, 200)
#     ]
#     income = 5000
#     non_debt_expenses = 3000
#     initial_savings_balance = 2000
    
#     strategies = ['avalanche', 'snowball', 'consolidation', 'high_minimum', 'savings_max']
#     risk_tolerances = ['low', 'medium', 'high']
    
#     for strategy in strategies:
#         for risk in risk_tolerances:
#             result = simulate_financial_plan(debts, income, non_debt_expenses, initial_savings_balance, 
#                                             risk_tolerance=risk, strategy=strategy)
#             print(f"\nStrategy: {strategy.capitalize()} | Risk Tolerance: {risk.capitalize()}")
#             print("Output for LLM:")
#             print(result)