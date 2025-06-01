import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const YearlyOverviewChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/dashboard/yearly-hours/')
      .then(res => {
        const groupedData = {};

        res.data.forEach(item => {
          const month = new Date(item.month).toLocaleString('default', { month: 'short' });
          const machine = item.machine__machine_number;
          if (!groupedData[month]) groupedData[month] = {};
          groupedData[month][machine] = item.total_hours;
        });

        const formatted = Object.keys(groupedData).map(month => ({
          month,
          ...groupedData[month]
        }));

        setChartData(formatted);
      });
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">📊 Yearly Working Hours Overview</h3>
      <BarChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        {Object.keys(chartData[0] || {}).filter(key => key !== 'month').map((key, i) => (
          <Bar key={key} dataKey={key} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
        ))}
      </BarChart>
    </div>
  );
};

export default YearlyOverviewChart;
