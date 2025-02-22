import PropTypes from 'prop-types';
import DebtRow from './DebtRow';

function DebtCard({ debtData, setDebtData }) {
  const handleAddRow = () => {
    setDebtData([
      ...debtData,
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
  };

  const handleDeleteRow = (id) => {
    setDebtData(debtData.filter(row => row.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setDebtData(
      debtData.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const toggleRowExpansion = (id) => {
    setDebtData(
      debtData.map(row =>
        row.id === id ? { ...row, isExpanded: !row.isExpanded } : row
      )
    );
  };

  const totalDebt = debtData.reduce((sum, row) => {
    const val = parseFloat(row.total);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Debt</h2>
      <div className="space-y-4">
        {debtData.map(row => (
          <DebtRow
            key={row.id}
            data={row}
            onChange={handleRowChange}
            onDelete={handleDeleteRow}
            onToggle={() => toggleRowExpansion(row.id)}
          />
        ))}
      </div>
      <button
        onClick={handleAddRow}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Row
      </button>
      <div className="mt-4 font-bold">Total Debt: ${totalDebt}</div>
    </div>
  );
}

DebtCard.propTypes = {
  debtData: PropTypes.array.isRequired,
  setDebtData: PropTypes.func.isRequired,
};

export default DebtCard;
