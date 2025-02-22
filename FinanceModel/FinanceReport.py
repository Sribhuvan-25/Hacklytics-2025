from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import json

def generate_financial_report(financial_data):
    """Generate a financial report using AdaptLLM/finance-LLM locally."""

    model_name = "AdaptLLM/finance-LLM"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    prompt = f"""
    Generate a detailed financial report based on the following data:
    {json.dumps(financial_data, indent=2)}
    
    Structure the report with these sections:
    1. Introduction: Greet the user and summarize the strategy and risk tolerance.
    2. Debt Repayment Plan: Explain the time to debt-free and total interest paid.
    3. Current Savings Status: Detail initial savings, monthly allocation, and savings at debt-free.
    4. Future Savings Projections: Discuss 5-year savings projections for each investment option.
    5. Conclusion: Summarize benefits and encourage action.
    
    Use a friendly, simple tone and avoid jargon. Limit the report to about 500 words.
    """
    
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_length=1000,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    
    report = tokenizer.decode(outputs[0], skip_special_tokens=True)
    report_start = report.find("Here’s your financial report:") if "Here’s your financial report:" in report else 0
    return report[report_start:] if report_start else report