import PropTypes from 'prop-types';

function DebtRow({ data, onChange, onDelete, onToggle }) {
  return (
    <div className="border p-2 rounded bg-gray-700">
      {/* Summary row */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1 mr-2">
          <input
            type="text"
            placeholder="Title"
            value={data.title}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange(data.id, 'title', e.target.value)}
            className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
          />
        </div>
        <div className="flex items-center mr-2">
          <span className="mr-1">$</span>
          <input
            type="number"
            placeholder="Total"
            value={data.total}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange(data.id, 'total', e.target.value)}
            className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-24"
          />
        </div>
        <span className="ml-2">{data.isExpanded ? '▲' : '▼'}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(data.id);
          }}
          className="ml-2 text-red-400 font-bold"
        >
          X
        </button>
      </div>

      {/* Expanded fields */}
      {data.isExpanded && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <label className="w-32">APR:</label>
            <input
              type="number"
              placeholder="APR"
              value={data.apr}
              onChange={(e) => onChange(data.id, 'apr', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-32">Monthly Payment:</label>
            <input
              type="number"
              placeholder="Monthly Payment"
              value={data.monthlyPayment}
              onChange={(e) => onChange(data.id, 'monthlyPayment', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-32">Tenure:</label>
            <input
              type="number"
              placeholder="Tenure"
              value={data.tenure}
              onChange={(e) => onChange(data.id, 'tenure', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-32">Remaining Balance:</label>
            <input
              type="number"
              placeholder="Remaining Balance"
              value={data.remainingBalance}
              onChange={(e) => onChange(data.id, 'remainingBalance', e.target.value)}
              className="bg-gray-600 border border-gray-600 p-2 text-white rounded w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

DebtRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    total: PropTypes.string,
    apr: PropTypes.string,
    monthlyPayment: PropTypes.string,
    tenure: PropTypes.string,
    remainingBalance: PropTypes.string,
    isExpanded: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default DebtRow;
