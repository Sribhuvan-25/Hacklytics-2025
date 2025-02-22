import PropTypes from 'prop-types';
import ExpenseSection from './ExpenseSection';

function ExpenseCard({ expensesData, setExpensesData }) {
  const handleUpdateSection = (section, newData) => {
    setExpensesData({
      ...expensesData,
      [section]: newData,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expenses</h2>
      {/* Needs Section */}
      <ExpenseSection
        title="Needs"
        data={expensesData.needs}
        onUpdate={(newData) => handleUpdateSection('needs', newData)}
      />
      {/* Wants Section */}
      <ExpenseSection
        title="Wants"
        data={expensesData.wants}
        onUpdate={(newData) => handleUpdateSection('wants', newData)}
      />
    </div>
  );
}

ExpenseCard.propTypes = {
  expensesData: PropTypes.shape({
    needs: PropTypes.array.isRequired,
    wants: PropTypes.array.isRequired,
  }).isRequired,
  setExpensesData: PropTypes.func.isRequired,
};

export default ExpenseCard;
