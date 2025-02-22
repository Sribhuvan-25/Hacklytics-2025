const mongoose = require('mongoose');
const { Schema } = mongoose;

const userDetailsSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});
// Schema for each income entry
const IncomeSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});

// Schema for each debt entry
const DebtSchema = new Schema({
  title: { type: String, required: true },
  monthlyPayment: { type: Number, required: true },
  apr: { type: Number, required: true },
  tenure: { type: Number, required: true },
  remainingBalance: { type: Number, required: true }
});

// Schema for an expense item (used for both needs and wants)
const ExpenseItemSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});

// Schema for the expenses object containing needs and wants arrays
const ExpensesSchema = new Schema({
  needs: { type: [ExpenseItemSchema], default: [] },
  wants: { type: [ExpenseItemSchema], default: [] }
});

// Main user schema combining income, debt, and expenses
const UserSchema = new Schema({
    userDetails:userDetailsSchema,
  income: { type: [IncomeSchema], default: [] },
  debt: { type: [DebtSchema], default: [] },
  expenses: ExpensesSchema
});

module.exports = mongoose.model('User', UserSchema);
