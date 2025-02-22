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

    llm = OllamaLLM(model="llama3.2", prompt=prompt)
    report = llm(prompt)
    return report
