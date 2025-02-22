import PropTypes from 'prop-types';

function ExpenseSection({ title, data, onUpdate }) {
  const handleAddRow = () => {
    onUpdate([...data, { id: Date.now(), description: '', amount: '' }]);
  };

  const handleDeleteRow = (id) => {
    onUpdate(data.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate(
      data.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const total = data.reduce((sum, item) => {
    const amt = parseFloat(item.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="flex items-center space-x-2 border p-2 rounded bg-gray-700">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleChange(item.id, 'description', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
            <div className="flex items-center space-x-1">
              <span>$</span>
              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => handleChange(item.id, 'amount', e.target.value)}
                className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
              />
            </div>
            <button
              onClick={() => handleDeleteRow(item.id)}
              className="text-red-400 font-bold"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddRow}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Row
      </button>
      <div className="mt-4 font-bold">Total: ${total}</div>
    </div>
  );
}

ExpenseSection.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ExpenseSection;
