/* eslint-disable react/prop-types */
const Card = ({ title, children, total, totalLabel = 'Total' }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 max-h-[600px] overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {children}
      {total !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-300">
            {totalLabel}: <span className="text-blue-400">${total}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Card;