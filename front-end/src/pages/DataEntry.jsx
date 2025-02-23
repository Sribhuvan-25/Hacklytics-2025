import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/forms/Card';
import InputField from '../components/forms/InputField';
import DebtField from '../components/forms/DebtField';
import AddButton from '../components/forms/AddButton';
import { submitFinancialData } from '../services/api';
import { Loader2 } from 'lucide-react';

function DataEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState([{ title: '', amount: '' }]);
  const [debt, setDebt] = useState([
    { title: '', monthlyPayment: '', apr: '', tenure: '', remainingBalance: '', isExpanded: false }
  ]);
  const [needs, setNeeds] = useState([{ title: '', amount: '' }]);
  const [wants, setWants] = useState([{ title: '', amount: '' }]);

  useEffect(() => {
    if (location.state?.prefillData) {
      const { income: incomeData, debt: debtData, expenses } = location.state.prefillData;
      setIncome(incomeData || [{ title: '', amount: '' }]);
      setDebt(debtData.map(item => ({ ...item, isExpanded: false })) || [{ title: '', monthlyPayment: '', apr: '', tenure: '', remainingBalance: '', isExpanded: false }]);
      setNeeds(expenses.needs || [{ title: '', amount: '' }]);
      setWants(expenses.wants || [{ title: '', amount: '' }]);
    }
  }, [location.state]);

  // Income handlers
  const addIncomeField = () => {
    setIncome([...income, { title: '', amount: '' }]);
  };

  const removeIncomeField = (index) => {
    const newIncome = income.filter((_, i) => i !== index);
    setIncome(newIncome);
  };

  const updateIncome = (index, field, value) => {
    const newIncome = [...income];
    newIncome[index][field] = value;
    setIncome(newIncome);
  };

  // Debt handlers
  const addDebtField = () => {
    setDebt([...debt, { title: '', monthlyPayment: '', apr: '', tenure: '', remainingBalance: '', isExpanded: false }]);
  };

  const removeDebtField = (index) => {
    const newDebt = debt.filter((_, i) => i !== index);
    setDebt(newDebt);
  };

  const updateDebt = (index, field, value) => {
    const newDebt = [...debt];
    newDebt[index][field] = value;
    setDebt(newDebt);
  };

  const toggleDebtExpand = (index) => {
    const newDebt = [...debt];
    newDebt[index].isExpanded = !newDebt[index].isExpanded;
    setDebt(newDebt);
  };

  // Needs handlers
  const addNeedsField = () => {
    setNeeds([...needs, { title: '', amount: '' }]);
  };

  const removeNeedsField = (index) => {
    const newNeeds = needs.filter((_, i) => i !== index);
    setNeeds(newNeeds);
  };

  const updateNeeds = (index, field, value) => {
    const newNeeds = [...needs];
    newNeeds[index][field] = value;
    setNeeds(newNeeds);
  };

  // Wants handlers
  const addWantsField = () => {
    setWants([...wants, { title: '', amount: '' }]);
  };

  const removeWantsField = (index) => {
    const newWants = wants.filter((_, i) => i !== index);
    setWants(newWants);
  };

  const updateWants = (index, field, value) => {
    const newWants = [...wants];
    newWants[index][field] = value;
    setWants(newWants);
  };

  // Calculate totals
  const calculateIncomeTotal = () => {
    return income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const calculateDebtTotal = () => {
    return debt.reduce((sum, item) => sum + (Number(item.monthlyPayment) || 0), 0);
  };

  const calculateNeedsTotal = () => {
    return needs.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const calculateWantsTotal = () => {
    return wants.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      income: income.map(({ title, amount }) => ({ 
        title, 
        amount: Number(amount) || 0 
      })),
      debt: debt.map(({ title, monthlyPayment, apr, remainingBalance, tenure }) => ({
        title,
        monthlyPayment: Number(monthlyPayment) || 0,
        apr: Number(apr) || 0,
        remainingBalance: Number(remainingBalance) || 0,
        tenure: Number(tenure) || 0
      })),
      expenses: {
        needs: needs.map(({ title, amount }) => ({ 
          title, 
          amount: Number(amount) || 0 
        })),
        wants: wants.map(({ title, amount }) => ({ 
          title, 
          amount: Number(amount) || 0 
        }))
      }
    };

    try {
      await submitFinancialData(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting data:', error);
      // For development, navigate anyway
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Financial Data Entry</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <Card title="Income" total={calculateIncomeTotal()}>
            {income.map((item, index) => (
              <InputField
                key={index}
                title={item.title}
                amount={item.amount}
                onTitleChange={(value) => updateIncome(index, 'title', value)}
                onAmountChange={(value) => updateIncome(index, 'amount', value)}
                onDelete={() => removeIncomeField(index)}
              />
            ))}
            <AddButton onClick={addIncomeField} label="Add Income" />
          </Card>

          {/* Debt Card */}
          <Card title="Debt" total={calculateDebtTotal()}>
            {debt.map((item, index) => (
              <DebtField
                key={index}
                debt={item}
                onUpdate={(field, value) => updateDebt(index, field, value)}
                onDelete={() => removeDebtField(index)}
                onToggle={() => toggleDebtExpand(index)}
              />
            ))}
            <AddButton onClick={addDebtField} label="Add Debt" />
          </Card>

          {/* Expenses Card */}
          <Card title="Expenses" total={calculateNeedsTotal() + calculateWantsTotal()}>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Needs</h3>
              {needs.map((item, index) => (
                <InputField
                  key={index}
                  title={item.title}
                  amount={item.amount}
                  onTitleChange={(value) => updateNeeds(index, 'title', value)}
                  onAmountChange={(value) => updateNeeds(index, 'amount', value)}
                  onDelete={() => removeNeedsField(index)}
                />
              ))}
              <AddButton onClick={addNeedsField} label="Add Need" />
              <div className="mt-2 text-sm text-gray-400">
                Total Needs: ${calculateNeedsTotal()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Wants</h3>
              {wants.map((item, index) => (
                <InputField
                  key={index}
                  title={item.title}
                  amount={item.amount}
                  onTitleChange={(value) => updateWants(index, 'title', value)}
                  onAmountChange={(value) => updateWants(index, 'amount', value)}
                  onDelete={() => removeWantsField(index)}
                />
              ))}
              <AddButton onClick={addWantsField} label="Add Want" />
              <div className="mt-2 text-sm text-gray-400">
                Total Wants: ${calculateWantsTotal()}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataEntry;