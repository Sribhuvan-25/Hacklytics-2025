import PropTypes from 'prop-types';

function IncomeCard({ incomeData, setIncomeData }) {
  const handleAddRow = () => {
    setIncomeData([...incomeData, { id: Date.now(), title: '', amount: '' }]);
  };

  const handleDeleteRow = (id) => {
    setIncomeData(incomeData.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setIncomeData(
      incomeData.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const total = incomeData.reduce((acc, item) => {
    const num = parseFloat(item.amount);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Income</h2>
      <div className="space-y-4">
        {incomeData.map(item => (
          <div key={item.id} className="flex items-center space-x-2 border p-2 rounded bg-gray-700">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleChange(item.id, 'title', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
            <div className="flex items-center space-x-1">
              <span>$</span>
              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => handleChange(item.id, 'amount', e.target.value)}
                className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-24"
              />
            </div>
            <button
              onClick={() => handleDeleteRow(item.id)}
              className="text-red-500 font-bold"
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

IncomeCard.propTypes = {
  incomeData: PropTypes.array.isRequired,
  setIncomeData: PropTypes.func.isRequired,
};

export default IncomeCard;
