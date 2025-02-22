import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IncomeCard from './components/IncomeCard';
import DebtCard from './components/DebtCard';
import ExpenseCard from './components/ExpenseCard';

function App() {
  const navigate = useNavigate();

  // Lift state for each section
  const [incomeData, setIncomeData] = useState([
    { id: Date.now(), title: '', amount: '' },
  ]);

  const [debtData, setDebtData] = useState([
    {
      id: Date.now(),
      title: '',
      total: '',
      apr: '',
      monthlyPayment: '',
      tenure: '',
      remainingBalance: '',
      isExpanded: false,
    },
  ]);

  const [expensesData, setExpensesData] = useState({
    // For expenses, we’ll have two categories: needs and wants
    needs: [{ id: Date.now(), description: '', amount: '' }],
    wants: [{ id: Date.now() + 1, description: '', amount: '' }],
  });

  const handleSubmit = async () => {
    // Build the JSON payload as described
    const incomeObj = {};
    incomeData.forEach((row, index) => {
      incomeObj[`textField${index + 1}`] = parseFloat(row.amount) || 0;
    });

    const debtObj = {};
    debtData.forEach((row, index) => {
      debtObj[`textField${index + 1}`] = {
        title: row.title,
        total: parseFloat(row.total) || 0,
        apr: parseFloat(row.apr) || 0,
        monthlyPayment: parseFloat(row.monthlyPayment) || 0,
        tenure: parseFloat(row.tenure) || 0,
        remainingBalance: parseFloat(row.remainingBalance) || 0,
      };
    });

    const needsObj = {};
    expensesData.needs.forEach((row, index) => {
      needsObj[`textField${index + 1}`] = parseFloat(row.amount) || 0;
    });

    const wantsObj = {};
    expensesData.wants.forEach((row, index) => {
      wantsObj[`textField${index + 1}`] = parseFloat(row.amount) || 0;
    });

    const payload = {
      income: incomeObj,
      debt: debtObj,
      expenses: {
        needs: needsObj,
        wants: wantsObj,
      },
    };

    try {
      const response = await fetch('http://127.0.0.1:3000/initialData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(payload);
      if (response.ok) {
        // Navigate to dashboard on success
        navigate('/dashboard');
      } else {
        console.error('Failed to submit:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 p-4 space-y-4">
      {/* Cards row */}
      <div className="flex flex-1 space-x-4">
        {/* Income Card */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto">
          <IncomeCard incomeData={incomeData} setIncomeData={setIncomeData} />
        </div>
        {/* Debt Card */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto">
          <DebtCard debtData={debtData} setDebtData={setDebtData} />
        </div>
        {/* Expenses Card */}
        <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto">
          <ExpenseCard expensesData={expensesData} setExpensesData={setExpensesData} />
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-center">
        <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-3 rounded">
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
