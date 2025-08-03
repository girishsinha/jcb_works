import React, { useState, useEffect } from 'react';
import api, { getFilteredWorkRecords, getOperators, updateSalary } from '../services/api';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SalaryTracker = ({ userAuthorityLevel }) => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    getOperators().then((res) => setOperators(res.data));
  }, []);

  useEffect(() => {
    if (selectedOperator && selectedYear) {
      api.get(`salary/?operator_id=${selectedOperator.id}&year=${selectedYear}`)
        .then(res => setSalaryRecords(res.data));
    }
  }, [selectedOperator, selectedYear]);

  const handleYearNavigation = (delta) => {
    setSelectedYear(prev => {
      const newYear = prev + delta;
      if (getYearOptions().includes(newYear)) return newYear;
      return prev;
    });
  };

  const handlePaidEdit = (recordId, newAmount) => {
    updateSalary(recordId, { amount_paid: newAmount }).then(() => {
      const updated = salaryRecords.map(r => {
        if (r.id === recordId) {
          const remaining = selectedOperator.salary - newAmount;
          let status = "Pending";
          if (remaining === 0 && newAmount === selectedOperator.salary) status = "Paid";
          else if (newAmount > 0 && remaining > 0) status = "Partially Paid";
          return { ...r, amount_paid: newAmount, remaining_salary: remaining, status };
        }
        return r;
      });
      setSalaryRecords(updated);
    });
  };

  const getYearOptions = () => {
    if (!selectedOperator) return [];
    const regYear = new Date(selectedOperator.registration_date).getFullYear();
    const currentYear = currentDate.getFullYear();
    return Array.from({ length: currentYear - regYear + 1 }, (_, i) => regYear + i);
  };

  const getVisibleMonths = () => {
    if (!selectedOperator || !selectedYear) return [];
    const regDate = new Date(selectedOperator.registration_date);
    const regYear = regDate.getFullYear();
    const regMonth = regDate.getMonth();
    const now = new Date();

    const isCurrentYear = selectedYear === now.getFullYear();
    const isRegYear = selectedYear === regYear;

    let start = isRegYear ? regMonth : 0;
    let end = isCurrentYear ? now.getMonth() : 11;

    return months.map((name, index) => ({ name, index })).slice(start, end + 1);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Salary Tracker</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          onChange={e => {
            const op = operators.find(o => o.id === parseInt(e.target.value));
            setSelectedOperator(op);
            if (op) {
              const regYear = new Date(op.registration_date).getFullYear();
              setSelectedYear(regYear);
            }
          }}
        >
          <option value="">Select Operator</option>
          {operators.map(op => (
            <option key={op.id} value={op.id}>{op.name}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          value={selectedYear || ''}
          onChange={e => setSelectedYear(parseInt(e.target.value))}
        >
          <option value="">Select Year</option>
          {getYearOptions().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => handleYearNavigation(-1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => handleYearNavigation(1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3 border-b">Month</th>
              <th className="px-4 py-3 border-b">Salary</th>
              <th className="px-4 py-3 border-b">Paid</th>
              <th className="px-4 py-3 border-b">Remaining</th>
              <th className="px-4 py-3 border-b">Status</th>
              <th className="px-4 py-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {getVisibleMonths().map(({ name, index }) => {
              const record = salaryRecords.find(r => r.month === index + 1);
              const isCurrentMonth = currentDate.getMonth() === index && currentDate.getFullYear() === selectedYear;
              const canEdit =
                userAuthorityLevel === 1 ||
                (userAuthorityLevel === 2 && isCurrentMonth && currentDate.getDate() <= 31);

              return (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">{name}</td>
                  <td className="px-4 py-2">{selectedOperator?.salary || 0}</td>
                  <td className="px-4 py-2">{record?.amount_paid ?? 0}</td>
                  <td className="px-4 py-2">{record?.remaining_salary ?? selectedOperator?.salary}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record?.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : record?.status === 'Partially Paid'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record?.status ?? 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {canEdit && record && (
                      <button
                        onClick={() => {
                          const input = prompt(`Enter paid amount for ${name}:`, record.amount_paid ?? '0');
                          const amount = parseFloat(input);
                          if (!isNaN(amount)) handlePaidEdit(record.id, amount);
                        }}
                        className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryTracker;
