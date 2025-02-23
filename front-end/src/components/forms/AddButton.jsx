/* eslint-disable react/prop-types */
import { Plus } from 'lucide-react';

const AddButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-2"
    >
      <Plus size={16} className="mr-1" /> {label}
    </button>
  );
};

export default AddButton;