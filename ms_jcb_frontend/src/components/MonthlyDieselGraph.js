import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const DieselGraph = () => {
  const [data, setData] = useState([]);
  const [jcbList, setJcbList] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalDiesel, setTotalDiesel] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/monthly-diesel/?month=${month}&year=${year}`)
      .then(response => {
        const rawData = response.data;
        const processed = [];
        const jcbSet = new Set();
        let total = 0;

        Object.keys(rawData).forEach(day => {
          const entry = { day };
          Object.entries(rawData[day]).forEach(([jcb, value]) => {
            entry[jcb] = value;
            total += value;
            jcbSet.add(jcb);
          });
          processed.push(entry);
        });

        setData(processed);
        setJcbList(Array.from(jcbSet));
        setTotalDiesel(total);
      });
  }, [month, year]);

  const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8', '#e83e8c'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fullDate = `${label.padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
      return (
        <div className="bg-white text-xs p-2 shadow-md rounded-md w-[120px] h-[80px] border border-gray-300 font-[Poppins]">
          <div className="font-semibold text-center text-xs mb-1">
            🏗️ JCB {payload[0].name}
          </div>
          <div className="text-gray-600 text-[10px]">
            📅 {fullDate}
          </div>
          <div className="text-gray-700 text-[10px]">
            ⛽ {payload[0].value} Litres
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 bg-white text-black rounded-md shadow-md border border-gray-300 w-[520px] font-[Poppins]">
      {/* Controls */}
      <div className="flex gap-3 mb-2 text-sm">
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="border p-1 rounded w-28"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'short' })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="border p-1 rounded w-24"
        >
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <BarChart
          width={31 * 18 + 40}
          height={240}
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}  // 🧽 reduced bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            fontSize={9}
            interval={0}
            height={20}  // 🧽 reduced from 50 to 20
            tick={{ fontSize: 9 }}
          />
          <YAxis
            fontSize={9}
            label={{
              value: 'Litres',
              angle: -90,
              position: 'insideLeft',
              fontSize: 9
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {jcbList.map((jcb, index) => (
            <Bar
              key={jcb}
              dataKey={jcb}
              name={jcb}
              fill={colors[index % colors.length]}
              barSize={15}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        {jcbList.map((jcb, index) => (
          <div key={jcb} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            JCB {jcb}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-xs font-semibold mt-1 text-gray-800">
        🚜 Total Diesel This Month: <span className="text-blue-600">{totalDiesel.toFixed(2)} Litres</span>
      </div>
    </div>
  );
};

export default DieselGraph;
