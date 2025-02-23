/* eslint-disable react/prop-types */
import { LayoutDashboard, DollarSign, CreditCard, PieChart } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'income', icon: DollarSign, label: 'Income' },
    { id: 'expenses', icon: PieChart, label: 'Expenses' },
    { id: 'debt', icon: CreditCard, label: 'Debt' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Finance Dashboard</h2>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors',
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;