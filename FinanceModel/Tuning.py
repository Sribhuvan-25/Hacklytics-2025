import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"  # Suppress parallelism warning

import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    DataCollatorForLanguageModeling,
    TrainingArguments,
    Trainer
)
from peft import get_peft_model, LoraConfig
import evaluate
import numpy as np

if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

print("Using device:", device)

dataset = load_dataset('Sribhuvan/FinanceData')
dataset = dataset["train"].train_test_split(test_size=0.1)
dataset["validation"] = dataset.pop("test")
print(dataset)

model_checkpoint = 'distilbert/distilgpt2'
model = AutoModelForCausalLM.from_pretrained(model_checkpoint)
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
tokenizer.pad_token = tokenizer.eos_token  # Set padding token for distilgpt2

def tokenize_function(examples):
    combined_text = [title + "\n" + content for title, content in zip(examples['Title'], examples['Content'])]
    return tokenizer(combined_text, truncation=True, max_length=1024)

tokenized_datasets = dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=dataset["train"].column_names
)

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False
)

# Configure LoRA
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["attn.c_attn"],
    lora_dropout=0.1,
    bias="none",
    task_type="CAUSAL_LM"
)

# Wrap the model with LoRA modifications
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# Move model to the selected device
model.to(device)

# Load evaluation metric
metric = evaluate.load("perplexity")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    if isinstance(logits, np.ndarray):
        logits = torch.from_numpy(logits)
    if isinstance(labels, np.ndarray):
        labels = torch.from_numpy(labels)
    # Shift logits and labels for causal LM loss calculation
    shift_logits = logits[..., :-1, :].contiguous()
    shift_labels = labels[..., 1:].contiguous()
    loss_fct = torch.nn.CrossEntropyLoss()
    loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))
    return {"perplexity": torch.exp(loss).item()}

# Training arguments
training_args = TrainingArguments(
    output_dir="./distilgpt2-finance",
    eval_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    save_strategy="epoch",
    load_best_model_at_end=True,
    push_to_hub=False,
    logging_steps=100,
    gradient_accumulation_steps=4,
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()

trainer.save_model("./distilgpt2-finance-final")
tokenizer.save_pretrained("./distilgpt2-finance-final")

model = model.merge_and_unload()
model.to(device)

prompt = "What is the best debt strategy?"
input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

attention_mask = torch.ones(input_ids.shape, device=device)

output_ids = model.generate(input_ids, attention_mask=attention_mask, max_length=512)
output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
print("Generated Text:", output_text)
