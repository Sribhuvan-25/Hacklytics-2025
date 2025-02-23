import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IncomeChart from '../components/charts/IncomeChart';
import ExpensesChart from '../components/charts/ExpenseChart';
import DebtChart from '../components/charts/DebtChart';
import ChatBot from '../components/chat/ChatBot';
import { getDashboardData } from '../services/api';
import { Loader2, PencilLine } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = () => {
    navigate('/', { state: { prefillData: dashboardData } });
  };

  // Calculate totals from the new data structure
  const calculateTotalIncome = () => {
    if (!dashboardData?.income) return 0;
    return dashboardData.income.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  };

  const calculateTotalDebt = () => {
    if (!dashboardData?.debt) return 0;
    return dashboardData.debt.reduce((total, item) => total + (Number(item.monthlyPayment) || 0), 0);
  };

  const calculateTotalExpenses = () => {
    if (!dashboardData?.expenses) return 0;
    const needsTotal = dashboardData.expenses.needs.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    const wantsTotal = dashboardData.expenses.wants.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    return needsTotal + wantsTotal;
  };

  // Format data for charts
  const formatIncomeData = () => {
    if (!dashboardData?.income) return { textField1: 0, textField2: 0 };
    return {
      textField1: dashboardData.income[0]?.amount || 0,
      textField2: dashboardData.income[1]?.amount || 0
    };
  };

  const formatDebtData = () => {
    if (!dashboardData?.debt) return {
      textField1: { title: '', total: 0, remainingBalance: 0 },
      textField2: { title: '', total: 0, remainingBalance: 0 }
    };
    
    return {
      textField1: {
        title: dashboardData.debt[0]?.title || '',
        total: dashboardData.debt[0]?.monthlyPayment || 0,
        remainingBalance: dashboardData.debt[0]?.remainingBalance || 0
      },
      textField2: {
        title: dashboardData.debt[1]?.title || '',
        total: dashboardData.debt[1]?.monthlyPayment || 0,
        remainingBalance: dashboardData.debt[1]?.remainingBalance || 0
      }
    };
  };

  const formatExpensesData = () => {
    if (!dashboardData?.expenses) return {
      needs: { textField1: 0, textField2: 0 },
      wants: { textField1: 0 }
    };
    
    return {
      needs: {
        textField1: dashboardData.expenses.needs[0]?.amount || 0,
        textField2: dashboardData.expenses.needs[1]?.amount || 0
      },
      wants: {
        textField1: dashboardData.expenses.wants[0]?.amount || 0
      }
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-red-500 text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'income':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Income Overview</h2>
            <IncomeChart data={formatIncomeData()} />
            <div className="mt-6 grid gap-4">
              {dashboardData.income.map((income, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-300 text-sm">{income.title}</h3>
                  <p className="text-2xl font-bold text-blue-400">${income.amount}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Expenses Breakdown</h2>
            <ExpensesChart data={formatExpensesData()} />
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Needs</h3>
                <div className="grid gap-4">
                  {dashboardData.expenses.needs.map((need, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-gray-300 text-sm">{need.title}</h4>
                      <p className="text-2xl font-bold text-blue-400">${need.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Wants</h3>
                <div className="grid gap-4">
                  {dashboardData.expenses.wants.map((want, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-gray-300 text-sm">{want.title}</h4>
                      <p className="text-2xl font-bold text-blue-400">${want.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'debt':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Debt Management</h2>
            <DebtChart data={formatDebtData()} />
            <div className="grid gap-4 mt-6">
              {dashboardData.debt.map((debt, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-300 text-sm">{debt.title}</h3>
                  <p className="text-2xl font-bold text-blue-400">${debt.monthlyPayment}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">APR:</span>
                      <span className="text-gray-200 ml-2">{debt.apr}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Remaining:</span>
                      <span className="text-gray-200 ml-2">${debt.remainingBalance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Income</h3>
                <p className="text-3xl font-bold text-blue-400">
                  ${calculateTotalIncome()}
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Expenses</h3>
                <p className="text-3xl font-bold text-green-400">
                  ${calculateTotalExpenses()}
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Debt</h3>
                <p className="text-3xl font-bold text-red-400">
                  ${calculateTotalDebt()}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleUpdateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PencilLine size={20} />
            <span>Update Finances</span>
          </button>
        </div>
        {renderContent()}
        <ChatBot financialData={dashboardData} />
      </main>
    </div>
  );
}

export default Dashboard;