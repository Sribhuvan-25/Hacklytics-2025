import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import IncomeChart from '../components/charts/IncomeChart';
import ExpensesChart from '../components/charts/ExpenseChart';
import DebtChart from '../components/charts/DebtChart';
import { getDashboardData } from '../services/api';
import { Loader2 } from 'lucide-react';

function Dashboard() {
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
            <IncomeChart data={dashboardData.income} />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-300 text-sm">Primary Income</h3>
                <p className="text-2xl font-bold text-blue-400">${dashboardData.income.textField1}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-300 text-sm">Secondary Income</h3>
                <p className="text-2xl font-bold text-blue-400">${dashboardData.income.textField2}</p>
              </div>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Expenses Breakdown</h2>
            <ExpensesChart data={dashboardData.expenses} />
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-300 text-sm">Needs 1</h3>
                <p className="text-2xl font-bold text-blue-400">${dashboardData.expenses.needs.textField1}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-300 text-sm">Needs 2</h3>
                <p className="text-2xl font-bold text-blue-400">${dashboardData.expenses.needs.textField2}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-300 text-sm">Wants</h3>
                <p className="text-2xl font-bold text-blue-400">${dashboardData.expenses.wants.textField1}</p>
              </div>
            </div>
          </div>
        );
      case 'debt':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Debt Management</h2>
            <DebtChart data={dashboardData.debt} />
            <div className="mt-6 grid grid-cols-2 gap-4">
              {Object.entries(dashboardData.debt).map(([key, debt]) => (
                <div key={key} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-300 text-sm">{debt.title}</h3>
                  <p className="text-2xl font-bold text-blue-400">${debt.total}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">APR:</span>
                      <span className="text-gray-200 ml-2">{debt.apr}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Monthly:</span>
                      <span className="text-gray-200 ml-2">${debt.monthlyPayment}</span>
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
                  ${dashboardData.income.textField1 + dashboardData.income.textField2}
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Expenses</h3>
                <p className="text-3xl font-bold text-green-400">
                  ${dashboardData.expenses.needs.textField1 + dashboardData.expenses.needs.textField2 + dashboardData.expenses.wants.textField1}
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Debt</h3>
                <p className="text-3xl font-bold text-red-400">
                  ${dashboardData.debt.textField1.total + dashboardData.debt.textField2.total}
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
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}

export default Dashboard;