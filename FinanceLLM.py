import torch
import time
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    TrainingArguments,
    PreTrainedTokenizerFast,
    pipeline,
    logging,
)

model_name = "ceadar-ie/FinanceConnect-13B"

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Create a quantization configuration for 8-bit loading
# quantization_config = BitsAndBytesConfig(load_in_8bit=True)

quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_enable_fp32_cpu_offload=True,
)

# Load the model using the quantization configuration
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    quantization_config=quantization_config,
    device_map="cpu",
    # trust_remote_code=True,
)

print("Model and tokenizer loaded successfully.")