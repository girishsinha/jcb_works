"use client";

import React, { useState, useEffect } from "react";
import api, {
  getFilteredWorkRecords,
  getOperators,
  updateSalary,
} from "../services/api";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SalaryTracker = ({ userAuthorityLevel }) => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getOperators().then((res) => setOperators(res.data));
  }, []);

  useEffect(() => {
    if (selectedOperator && selectedYear) {
      api
        .get(`salary/?operator_id=${selectedOperator.id}&year=${selectedYear}`)
        .then((res) => setSalaryRecords(res.data));
    }
  }, [selectedOperator, selectedYear]);

  const handleYearNavigation = (delta) => {
    setSelectedYear((prev) => {
      const newYear = prev + delta;
      const validYears = getYearOptions();
      if (validYears.includes(newYear)) return newYear;
      return prev;
    });
  };

  const handlePaidEdit = (recordId, newAmount) => {
    updateSalary(recordId, { amount_paid: newAmount }).then(() => {
      const updated = salaryRecords.map((r) => {
        if (r.id === recordId) {
          const remaining = selectedOperator.salary - newAmount;
          let status = "Pending";
          if (remaining === 0 && newAmount === selectedOperator.salary)
            status = "Paid";
          else if (newAmount > 0 && remaining > 0) status = "Partially Paid";
          return {
            ...r,
            amount_paid: newAmount,
            remaining_salary: remaining,
            status,
          };
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
    return Array.from(
      { length: currentYear - regYear + 1 },
      (_, i) => regYear + i
    );
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
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Salary Tracker</h2>

      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
          onChange={(e) => {
            const op = operators.find((o) => o.id === parseInt(e.target.value));
            setSelectedOperator(op);
            if (op) {
              const regYear = new Date(op.registration_date).getFullYear();
              setSelectedYear(regYear);
            }
          }}
        >
          <option value="">Select Operator</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          <option value="">Select Year</option>
          {getYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleYearNavigation(-1)}
            className="px-2 py-1 border rounded"
          >
            Previous
          </button>
          <button
            onClick={() => handleYearNavigation(1)}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-2">Month</th>
            <th className="border p-2">Salary</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Remaining</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {getVisibleMonths().map(({ name, index }) => {
            const record = salaryRecords.find((r) => r.month === index + 1);
            const isCurrentMonth =
              currentDate.getMonth() === index &&
              currentDate.getFullYear() === selectedYear;
            const canEdit =
              userAuthorityLevel === 1 ||
              (userAuthorityLevel === 2 &&
                isCurrentMonth &&
                currentDate.getDate() <= 31); // Only until last day

            return (
              <tr key={index}>
                <td className="border p-2">{name}</td>
                <td className="border p-2">{selectedOperator?.salary || 0}</td>
                <td className="border p-2">{record?.amount_paid ?? 0}</td>
                <td className="border p-2">
                  {record?.remaining_salary ?? selectedOperator?.salary}
                </td>
                <td className="border p-2">{record?.status ?? "Pending"}</td>
                <td className="border p-2">
                  {canEdit && record && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        const input = prompt(
                          `Enter paid amount for ${name}:`,
                          record.amount_paid ?? "0"
                        );
                        const amount = parseFloat(input);
                        if (!isNaN(amount)) handlePaidEdit(record.id, amount);
                      }}
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
  );
};

export default SalaryTracker;
