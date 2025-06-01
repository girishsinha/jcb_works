// import React, { useEffect, useState } from 'react';
// import { getFilteredWorkRecords, getOperators, updateSalary } from '../services/api';



// export default function SalaryTracker() {
//   const [operators, setOperators] = useState([]);
//   const [selected, setSelected] = useState({ operator: '', year: '' });
//   const [records, setRecords] = useState([]);

//   useEffect(() => {
//     getOperators().then(res => setOperators(res.data));
//   }, []);

//   const fetchSalary = async () => {
//     if (!selected.operator || !selected.year) return;
//     const res = await getFilteredWorkRecords(`operator=${selected.operator}&year=${selected.year}`);
//     setRecords(res.data);
//   };

//   useEffect(() => {
//     fetchSalary();
//   }, [selected]);

//   const currentMonth = new Date().getMonth() + 1;

//   const handleAmountChange = (idx, value) => {
//     const updated = [...records];
//     updated[idx].amount_paid = parseFloat(value) || 0;
//     setRecords(updated);
//   };

//   const saveAmount = async (record) => {
//     const { id, amount_paid } = record;
//     try {
//       await updateSalary(id, { amount_paid });
//       fetchSalary();
//     } catch (e) {
//       alert("Update failed");
//     }
//   };

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   return (
//     <div className="p-4 max-w-screen-xl mx-auto">
//       <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
//         <select onChange={e => setSelected({ ...selected, operator: e.target.value })}
//           className="border p-2 rounded-md shadow-sm w-64">
//           <option value="">Select Operator</option>
//           {operators.map(op => (
//             <option key={op.id} value={op.id}>{op.name}</option>
//           ))}
//         </select>
//         <input type="number" placeholder="Year (e.g. 2024)"
//           onChange={e => setSelected({ ...selected, year: e.target.value })}
//           className="border p-2 rounded-md shadow-sm w-48" />
//       </div>

//       <div className="overflow-x-auto border rounded-lg shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Month</th>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Salary</th>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Paid</th>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Remaining</th>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
//               <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {records.map((rec, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 <td className="px-4 py-2">{months[rec.month - 1]}</td>
//                 <td className="px-4 py-2">₹{rec.total_salary}</td>
//                 <td className="px-4 py-2">
//                   {(parseInt(selected.year) === new Date().getFullYear() && rec.month === currentMonth) ? (
//                     <input
//                       type="number"
//                       value={rec.amount_paid}
//                       onChange={e => handleAmountChange(idx, e.target.value)}
//                       className="border p-1 rounded w-24 text-sm"
//                     />
//                   ) : (
//                     <>₹{rec.amount_paid}</>
//                   )}
//                 </td>
//                 <td className="px-4 py-2">₹{rec.remaining_salary}</td>
//                 <td className="px-4 py-2 capitalize text-sm font-medium">
//                   <span className={
//                     rec.status === 'Paid' ? 'text-green-600' :
//                       rec.status === 'Pending' ? 'text-red-600' : 'text-yellow-600'}>
//                     {rec.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">
//                   {(parseInt(selected.year) === new Date().getFullYear() && rec.month === currentMonth) && (
//                     <button
//                       onClick={() => saveAmount(rec)}
//                       className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow"
//                     >
//                       Save
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {records.length > 0 && (
//         <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow w-full sm:w-fit">
//           <h3 className="font-semibold text-lg mb-3">Summary</h3>
//           <div className="space-y-1 text-sm">
//             <p><strong>Operator:</strong> {operators.find(o => o.id == selected.operator)?.name}</p>
//             <p><strong>Total:</strong> ₹{records.reduce((sum, r) => sum + parseFloat(r.total_salary), 0)}</p>
//             <p><strong>Paid:</strong> ₹{records.reduce((sum, r) => sum + parseFloat(r.amount_paid), 0)}</p>
//             <p><strong>Remaining:</strong> ₹{records.reduce((sum, r) => sum + r.remaining_salary, 0)}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // NewCode 
// import React, { useState, useEffect } from 'react';
// import api, {getFilteredWorkRecords, getOperators, updateSalary } from '../services/api';

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const SalaryTracker = ({ userAuthorityLevel }) => {
//   const [operators, setOperators] = useState([]);
//   const [selectedOperator, setSelectedOperator] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [salaryRecords, setSalaryRecords] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     getOperators().then((res) => setOperators(res.data));
//   }, []);

//   useEffect(() => {
//     if (selectedOperator && selectedYear) {
//       api.get(`salary/?operator_id=${selectedOperator.id}&year=${selectedYear}`)
//         .then(res => setSalaryRecords(res.data));
//     }
//   }, [selectedOperator, selectedYear]);

//   // const handleYearNavigation = (delta) => {
//   //   setSelectedYear(prev => prev + delta);
//   // };
//   const handleYearNavigation = (delta) => {
//     const regYear = new Date(selectedOperator.registration_date).getFullYear();
//     const newYear = selectedYear + delta;

//     if (newYear >= regYear && newYear <= currentDate.getFullYear()) {
//       setSelectedYear(newYear);
//     }
//   };


//   const handlePaidEdit = (recordId, newAmount) => {
//     updateSalary(recordId, { amount_paid: newAmount }).then(() => {
//       const updated = salaryRecords.map(r => r.id === recordId ? { ...r, amount_paid: newAmount } : r);
//       setSalaryRecords(updated);
//     });
//   };

//   const getYearOptions = () => {
//     if (!selectedOperator) return [];
//     const regYear = new Date(selectedOperator.registration_date).getFullYear();
//     const currentYear = currentDate.getFullYear();
//     return Array.from({ length: currentYear - regYear + 1 }, (_, i) => regYear + i);
//   };

//   const getVisibleMonths = () => {
//     if (!selectedOperator || !selectedYear) return [];
//     const regDate = new Date(selectedOperator.registration_date);
//     const regYear = regDate.getFullYear();
//     const regMonth = regDate.getMonth();
//     const now = new Date();
//     const isCurrentYear = selectedYear === now.getFullYear();
//     let start = selectedYear === regYear ? regMonth : 0;
//     let end = isCurrentYear ? now.getMonth() : 11;
//     return months.map((m, i) => ({ name: m, index: i })).slice(start, end + 1);
//   };

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md">
//       <h2 className="text-xl font-bold mb-4">Salary Tracker</h2>

//       <div className="flex gap-4 mb-4">
//         <select
//           className="p-2 border rounded"
//           onChange={e => setSelectedOperator(operators.find(o => o.id === parseInt(e.target.value)))}>
//           <option value="">Select Operator</option>
//           {operators.map(op => (
//             <option key={op.id} value={op.id}>{op.name}</option>
//           ))}
//         </select>

//         <select
//           className="p-2 border rounded"
//           value={selectedYear || ''}
//           onChange={e => setSelectedYear(parseInt(e.target.value))}>
//           <option value="">Select Year</option>
//           {getYearOptions().map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>

//         {/* <div className="flex items-center gap-2">
//           <button onClick={() => handleYearNavigation(-1)} className="px-2 py-1 border rounded">Previous</button>
//           <button onClick={() => handleYearNavigation(1)} className="px-2 py-1 border rounded">Next</button>
//         </div> */}

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleYearNavigation(-1)}
//             disabled={selectedYear <= new Date(selectedOperator?.registration_date).getFullYear()}
//             className="px-2 py-1 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => handleYearNavigation(1)}
//             disabled={selectedYear >= currentDate.getFullYear()}
//             className="px-2 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>




//       </div>

//       <table className="w-full border">
//         <thead>
//           <tr>
//             <th className="border p-2">Month</th>
//             <th className="border p-2">Salary</th>
//             <th className="border p-2">Paid</th>
//             <th className="border p-2">Remaining</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {getVisibleMonths().map(monthObj => {
//             const record = salaryRecords.find(r => r.month === monthObj.index + 1);
//             const canEdit = userAuthorityLevel === 1 || 
//               (userAuthorityLevel === 2 && selectedYear === currentDate.getFullYear() && monthObj.index === currentDate.getMonth());

//             return (
//               <tr key={monthObj.index}>
//                 <td className="border p-2">{monthObj.name}</td>
//                 <td className="border p-2">{selectedOperator?.salary}</td>
//                 <td className="border p-2">{record?.amount_paid ?? 0}</td>
//                 <td className="border p-2">{record ? record.remaining_salary : selectedOperator?.salary}</td>
//                 <td className="border p-2">{record?.status || 'Pending'}</td>
//                 <td className="border p-2">
//                   {canEdit && (
//                     <button
//                       className="bg-blue-500 text-white px-2 py-1 rounded"
//                       onClick={() => {
//                         const newAmount = prompt('Enter paid amount:', record?.amount_paid ?? '0');
//                         if (newAmount != null) handlePaidEdit(record.id, parseFloat(newAmount));
//                       }}>
//                       Edit
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SalaryTracker;


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
  const [currentDate, setCurrentDate] = useState(new Date());

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
      const validYears = getYearOptions();
      if (validYears.includes(newYear)) return newYear;
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

    return months.map((name, index) => ({ name, index }))
                 .slice(start, end + 1);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Salary Tracker</h2>

      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          value={selectedYear || ''}
          onChange={e => setSelectedYear(parseInt(e.target.value))}>
          <option value="">Select Year</option>
          {getYearOptions().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button onClick={() => handleYearNavigation(-1)} className="px-2 py-1 border rounded">Previous</button>
          <button onClick={() => handleYearNavigation(1)} className="px-2 py-1 border rounded">Next</button>
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
            const record = salaryRecords.find(r => r.month === index + 1);
            const isCurrentMonth = currentDate.getMonth() === index && currentDate.getFullYear() === selectedYear;
            const canEdit =
              userAuthorityLevel === 1 ||
              (userAuthorityLevel === 2 && isCurrentMonth && currentDate.getDate() <= 31); // Only until last day

            return (
              <tr key={index}>
                <td className="border p-2">{name}</td>
                <td className="border p-2">{selectedOperator?.salary || 0}</td>
                <td className="border p-2">{record?.amount_paid ?? 0}</td>
                <td className="border p-2">{record?.remaining_salary ?? selectedOperator?.salary}</td>
                <td className="border p-2">{record?.status ?? 'Pending'}</td>
                <td className="border p-2">
                  {canEdit && record && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        const input = prompt(`Enter paid amount for ${name}:`, record.amount_paid ?? '0');
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
