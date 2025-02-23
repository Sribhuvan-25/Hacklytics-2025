/* eslint-disable react/prop-types */
import { DollarSign, X, ChevronDown, ChevronUp } from 'lucide-react';

const DebtField = ({ debt, onUpdate, onDelete, onToggle }) => {
  return (
    <div className="mb-4 bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={debt.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Debt Title"
            className="w-full bg-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex items-center bg-gray-600 rounded">
            <span className="px-3 text-gray-400">
              <DollarSign size={16} />
            </span>
            <input
              type="number"
              value={debt.monthlyPayment}
              onChange={(e) => onUpdate('monthlyPayment', e.target.value)}
              placeholder="Monthly Payment"
              className="w-full bg-transparent text-white px-2 py-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            {debt.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      {debt.isExpanded && (
        <div className="mt-3 space-y-2">
          <input
            type="number"
            value={debt.apr}
            onChange={(e) => onUpdate('apr', e.target.value)}
            placeholder="APR %"
            className="w-full bg-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            value={debt.tenure}
            onChange={(e) => onUpdate('tenure', e.target.value)}
            placeholder="Tenure (months)"
            className="w-full bg-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex items-center bg-gray-600 rounded">
            <span className="px-3 text-gray-400">
              <DollarSign size={16} />
            </span>
            <input
              type="number"
              value={debt.remainingBalance}
              onChange={(e) => onUpdate('remainingBalance', e.target.value)}
              placeholder="Remaining Balance"
              className="w-full bg-transparent text-white px-2 py-2 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtField;