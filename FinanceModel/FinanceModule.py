import copy
import math
import random
import json

###############################
# Basic Financial Calculations #
###############################

def compute_total_income(income_list):
    """Sum all income amounts."""
    total = sum(item.get("amount", 0) for item in income_list)
    return total

def compute_total_expenses(expenses):
    """Compute total expenses for 'needs' and 'wants' separately and combined."""
    total_needs = sum(item.get("amount", 0) for item in expenses.get("needs", []))
    total_wants = sum(item.get("amount", 0) for item in expenses.get("wants", []))
    return total_needs, total_wants, total_needs + total_wants

def compute_debt_summary(debts):
    """Compute total debt and list of debts with computed monthly interest."""
    total_debt = 0
    detailed_debts = []
    for d in debts:
        amount = d.get("total_amount", 0)
        monthly_payment = d.get("monthly_payment", 0)
        apr = d.get("apr", 0)
        tenure = d.get("tenure", 0)  # in months
        monthly_interest_rate = apr / 12
        monthly_interest = amount * monthly_interest_rate
        total_debt += amount
        detailed_debts.append({
            "name": d.get("name", ""),
            "total_amount": amount,
            "monthly_payment": monthly_payment,
            "apr": apr,
            "tenure": tenure,
            "monthly_interest": monthly_interest
        })
    return total_debt, detailed_debts

##############################################
# Debt Repayment Simulations (Different Strategies)
##############################################

def simulate_debt_repayment_avalanche(debts, extra_payment):
    """
    Simulate the debt avalanche strategy (pay highest APR first).
    :param debts: List of debt dictionaries (copy them before simulation).
    :param extra_payment: Extra funds available each month to pay towards debt.
    :return: Total months required and total interest paid.
    """
    # Sort debts by descending APR (highest interest first)
    debts = sorted(copy.deepcopy(debts), key=lambda d: d.get("apr", 0), reverse=True)
    total_interest = 0
    months = 0

    while any(d["total_amount"] > 0 for d in debts):
        months += 1
        total_min_payment = sum(min(d["monthly_payment"], d["total_amount"]) for d in debts if d["total_amount"] > 0)
        available_extra = extra_payment
        for d in debts:
            if d["total_amount"] <= 0:
                continue
            monthly_rate = d["apr"] / 12
            interest = d["total_amount"] * monthly_rate
            total_interest += interest
            d["total_amount"] += interest
            pay = min(d["monthly_payment"], d["total_amount"])
            d["total_amount"] -= pay
        for d in debts:
            if d["total_amount"] > 0 and available_extra > 0:
                payment = min(available_extra, d["total_amount"])
                d["total_amount"] -= payment
                available_extra -= payment
                if available_extra <= 0:
                    break
    return months, total_interest

def simulate_debt_repayment_snowball(debts, extra_payment):
    """
    Simulate the debt snowball strategy (pay smallest balance first).
    :param debts: List of debt dictionaries (copy them before simulation).
    :param extra_payment: Extra funds available each month to pay towards debt.
    :return: Total months required and total interest paid.
    """
    debts = sorted(copy.deepcopy(debts), key=lambda d: d["total_amount"])
    total_interest = 0
    months = 0

    while any(d["total_amount"] > 0 for d in debts):
        months += 1
        total_min_payment = sum(min(d["monthly_payment"], d["total_amount"]) for d in debts if d["total_amount"] > 0)
        available_extra = extra_payment
        for d in debts:
            if d["total_amount"] <= 0:
                continue
            monthly_rate = d["apr"] / 12
            interest = d["total_amount"] * monthly_rate
            total_interest += interest
            d["total_amount"] += interest
            pay = min(d["monthly_payment"], d["total_amount"])
            d["total_amount"] -= pay
        for d in debts:
            if d["total_amount"] > 0 and available_extra > 0:
                payment = min(available_extra, d["total_amount"])
                d["total_amount"] -= payment
                available_extra -= payment
                if available_extra <= 0:
                    break
        debts = sorted(debts, key=lambda d: d["total_amount"])
    return months, total_interest

def simulate_debt_consolidation(debts, consolidation_rate, consolidation_term):
    """
    Calculate a consolidated monthly payment and simulate repayment.
    :param debts: List of debt dictionaries.
    :param consolidation_rate: New APR for consolidation.
    :param consolidation_term: Term in months.
    :return: Consolidated monthly payment, total interest paid over term.
    """
    total_balance = sum(d["total_amount"] for d in debts)
    monthly_rate = consolidation_rate / 12
    payment = total_balance * (monthly_rate * (1 + monthly_rate) ** consolidation_term) / ((1 + monthly_rate) ** consolidation_term - 1)
    total_interest = 0
    remaining_balance = total_balance
    for _ in range(consolidation_term):
        interest = remaining_balance * monthly_rate
        total_interest += interest
        remaining_balance += interest - payment
        if remaining_balance < 0:
            remaining_balance = 0
            break
    return payment, total_interest

########################################
# Savings Projection (Compound Growth)
########################################

def project_savings_growth(initial_savings, monthly_contribution, annual_rate, years):
    """
    Calculate future value of savings with monthly contributions and compound interest.
    """
    months = years * 12
    monthly_rate = annual_rate / 12
    future_value = initial_savings * ((1 + monthly_rate) ** months)
    for m in range(1, months + 1):
        future_value += monthly_contribution * ((1 + monthly_rate) ** (months - m))
    return future_value

#######################################
# Main Financial Module Functionality #
#######################################

def compute_financial_analysis(user_data):
    """
    Compute a comprehensive set of financial metrics and simulation results.
    
    Expected user_data format:
    {
      "income": [{"title": "Job", "amount": 5000}, {"title": "Side Hustle", "amount": 1000}],
      "debt": [
          {"name": "Credit Card", "total_amount": 5000, "monthly_payment": 100, "apr": 0.18, "tenure": 60},
          {"name": "Car Loan", "total_amount": 10000, "monthly_payment": 200, "apr": 0.05, "tenure": 60}
      ],
      "expenses": {
          "needs": [{"title": "Rent", "amount": 1500}, {"title": "Utilities", "amount": 300}],
          "wants": [{"title": "Dining Out", "amount": 200}, {"title": "Entertainment", "amount": 150}]
      },
      "savings": 2000
    }
    """
    total_income = compute_total_income(user_data.get("income", []))
    total_needs, total_wants, total_expenses = compute_total_expenses(user_data.get("expenses", {}))
    
    total_debt, detailed_debts = compute_debt_summary(user_data.get("debt", []))
    
    total_min_debt_payments = sum(d.get("monthly_payment", 0) for d in user_data.get("debt", []))
    net_cash_flow = total_income - (total_expenses + total_min_debt_payments)
    
    recommended_savings_rate = 0.2  # 20%
    recommended_monthly_savings = max(net_cash_flow * recommended_savings_rate, 0)
    
    extra_funds = max(net_cash_flow - recommended_monthly_savings, 0)
    
    avalanche_months, avalanche_interest = simulate_debt_repayment_avalanche(user_data.get("debt", []), extra_funds)
    snowball_months, snowball_interest = simulate_debt_repayment_snowball(user_data.get("debt", []), extra_funds)
    
    consolidation_rate = 0.08
    consolidation_term = 60
    consolidation_payment, consolidation_interest = simulate_debt_consolidation(user_data.get("debt", []), consolidation_rate, consolidation_term)
    
    annual_savings_rate = 0.04
    projected_savings_5_years = project_savings_growth(user_data.get("savings", 0) + recommended_monthly_savings, recommended_monthly_savings, annual_savings_rate, 5)
    
    analysis = {
        "Financial Summary": {
            "Total Income": total_income,
            "Total Expenses": total_expenses,
            "  Needs": total_needs,
            "  Wants": total_wants,
            "Total Debt": total_debt,
            "Current Savings": user_data.get("savings", 0),
            "Net Cash Flow": net_cash_flow,
            "Recommended Monthly Savings": recommended_monthly_savings
        },
        "Debt Details": detailed_debts,
        "Debt Repayment Simulations": {
            "Avalanche Strategy": {
                "Estimated Months to Debt-Free": avalanche_months,
                "Total Interest Paid": avalanche_interest,
                "Extra Funds Used Monthly": extra_funds
            },
            "Snowball Strategy": {
                "Estimated Months to Debt-Free": snowball_months,
                "Total Interest Paid": snowball_interest,
                "Extra Funds Used Monthly": extra_funds
            },
            "Consolidation Strategy": {
                "Monthly Consolidated Payment": consolidation_payment,
                "Total Interest Over Term": consolidation_interest,
                "Term (months)": consolidation_term,
                "Assumed Consolidation APR": consolidation_rate
            }
        },
        "Savings Projection": {
            "Projected Savings in 5 Years": projected_savings_5_years,
            "Assumed Annual Savings Growth Rate": annual_savings_rate
        }
    }
    
    return analysis

##########################
# Example Usage of Module #
##########################

def round_floats(obj):
    """
    Recursively round all float values in a nested structure (dict or list) to 2 decimal places.
    """
    if isinstance(obj, dict):
        return {k: round_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [round_floats(elem) for elem in obj]
    elif isinstance(obj, float):
        return round(obj, 2)
    else:
        return obj

if __name__ == "__main__":
    user_data = {
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
    
    analysis = compute_financial_analysis(user_data)
    
    analysis = round_floats(analysis)
    
    json_output = json.dumps(analysis, indent=2)
    
    print(json_output)