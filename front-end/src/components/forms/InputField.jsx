/* eslint-disable react/prop-types */
import { DollarSign, X } from 'lucide-react';

const InputField = ({ title, amount, onTitleChange, onAmountChange, onDelete }) => {
  return (
    <div className="mb-4 flex gap-2">
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Title"
          className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex items-center bg-gray-700 rounded">
          <span className="px-3 text-gray-400">
            <DollarSign size={16} />
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Amount"
            className="w-full bg-transparent text-white px-2 py-2 focus:outline-none"
          />
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default InputField;