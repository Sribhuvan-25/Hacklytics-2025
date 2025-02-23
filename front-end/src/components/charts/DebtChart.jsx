/* eslint-disable react/prop-types */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DebtChart = ({ data }) => {
  const chartData = [
    {
      name: data.textField1.title,
      total: data.textField1.total,
      remaining: data.textField1.remainingBalance,
    },
    {
      name: data.textField2.title,
      total: data.textField2.total,
      remaining: data.textField2.remainingBalance,
    },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
          />
          <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" fill="#60A5FA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DebtChart;