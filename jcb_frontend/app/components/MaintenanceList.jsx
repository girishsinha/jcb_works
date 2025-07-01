// import React, { useEffect, useState } from 'react';
// import { getMaintenance, getMachines } from '../services/api';
// import MaintenanceForm from './MaintenanceForm';

// const userAuthorityLevel = 2; // change as per actual logic

// export default function MaintenanceList() {
//   const [records, setRecords] = useState([]);
//   const [machines, setMachines] = useState([]);
//   const [filters, setFilters] = useState({ machine: '', month: '', year: '' });
//   const [editing, setEditing] = useState(null);

//   const loadRecords = () => {
//     const query = Object.entries(filters)
//       .filter(([_, v]) => v)
//       .map(([k, v]) => `${k}=${v}`)
//       .join('&');
//     getMaintenance(query).then(res => setRecords(res.data));
//   };

//   useEffect(() => {
//     getMachines().then(res => setMachines(res.data));
//   }, []);

//   useEffect(() => {
//     if (filters.machine) loadRecords();
//   }, [filters]);

//   return (
//     <div className="mt-6">
//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-4">
//         <select onChange={e => setFilters({ ...filters, machine: e.target.value })} className="border p-2 rounded">
//           <option value="">Select Machine</option>
//           {machines.map(m => (
//             <option key={m.id} value={m.id}>{m.name}</option>
//           ))}
//         </select>
//         <select onChange={e => setFilters({ ...filters, month: e.target.value })} className="border p-2 rounded">
//           <option value="">Month</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
//           ))}
//         </select>
//         <input type="number" placeholder="Year" onChange={e => setFilters({ ...filters, year: e.target.value })} className="border p-2 rounded w-28" />
//       </div>

//       {/* Maintenance Form */}
//       <MaintenanceForm record={editing} onSuccess={() => { setEditing(null); loadRecords(); }} />

//       {/* Table or Message */}
//       {filters.machine ? (
//         <table className="w-full mt-6 border text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Machine No</th>
//               <th className="border p-2">Maintenance Type</th>
//               <th className="border p-2">Part Repaired</th>
//               <th className="border p-2">Maintenance Date</th>
//               <th className="border p-2">Cost</th>
//               <th className="border p-2">Bill</th>
//               <th className="border p-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((r) => (
//               <tr key={r.id} className="border">
//                 <td className="p-2">{r.machine_name}</td>
//                 <td className="p-2">{r.maintenance_type}</td>
//                 <td className="p-2">{r.part_repaired}</td>
//                 <td className="p-2">{r.date}</td>
//                 <td className="p-2">₹{r.cost}</td>
//                 <td className="p-2">
//                   {r.bill ? (
//                     <a href={r.bill} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
//                   ) : 'No'}
//                 </td>
//                 <td className="p-2 text-center">
//                   {userAuthorityLevel <= 2 ? (
//                     <button onClick={() => setEditing(r)} className="text-blue-600 text-xl" title="Edit">✏️</button>
//                   ) : (
//                     <span title="Not Editable">✅</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <div className="mt-6 text-center text-gray-600 italic">
//           Please select a machine to view maintenance records.
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { getMaintenance, getMachines } from "../services/api";

const userAuthorityLevel = 2;

export default function MaintenanceList() {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({
    machine: "",
    month: "",
    year: new Date().getFullYear(),
  });
  const [editing, setEditing] = useState(null);

  const loadRecords = () => {
    const query = Object.entries(filters)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k === "machine" ? "machine_id" : k}=${v}`)
      .join("&");
    getMaintenance(query)
      .then((res) => setRecords(res.data))
      .catch((err) => {
        console.error("Failed to load maintenance records:", err);
        setRecords([]);
      });
  };

  useEffect(() => {
    getMachines().then((res) => setMachines(res.data));
  }, []);

  useEffect(() => {
    if (filters.year || filters.machine || filters.month) loadRecords();
  }, [filters]);

  const renderTableRows = (machineRecords) =>
    machineRecords.map((r) => (
      <tr key={r.id} className="border">
        <td className="p-2">
          {machines.find((m) => m.id === r.machine)?.machine_number ||
            r.machine}
        </td>
        <td className="p-2">{r.maintenance_type}</td>
        <td className="p-2">{r.part_repaired}</td>
        <td className="p-2">{r.maintenance_date}</td>
        <td className="p-2">₹{r.cost}</td>
        <td className="p-2 text-center">
          {r.bill_file ? (
            <a
              href={r.bill_file}
              target="_blank"
              rel="noreferrer"
              title="View Bill"
              className="text-blue-600 text-lg"
            >
              👁️
            </a>
          ) : (
            <span title="No Bill Uploaded" className="text-red-500 text-lg">
              ❌
            </span>
          )}
        </td>

        <td className="p-2 text-center">
          {userAuthorityLevel <= 2 ? (
            <button
              onClick={() => setEditing(r)}
              className="text-blue-600 text-xl"
              title="Edit"
            >
              ✏️
            </button>
          ) : (
            <span title="Not Editable">✅</span>
          )}
        </td>
      </tr>
    ));

  const groupedRecords = () => {
    const grouped = {};
    records.forEach((record) => {
      const machineId = record.machine;
      if (!grouped[machineId]) grouped[machineId] = [];
      grouped[machineId].push(record);
    });
    return grouped;
  };

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.machine}
          onChange={(e) => setFilters({ ...filters, machine: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Machines</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.machine_number}
            </option>
          ))}
        </select>

        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>
          {[...Array(10)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Maintenance Records Table */}
      {records.length > 0 ? (
        filters.machine ? (
          <table className="w-full mt-6 border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Machine No</th>
                <th className="border p-2">Maintenance Type</th>
                <th className="border p-2">Part Repaired</th>
                <th className="border p-2">Maintenance Date</th>
                <th className="border p-2">Cost</th>
                <th className="border p-2">Bill</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(records)}</tbody>
          </table>
        ) : (
          Object.entries(groupedRecords()).map(
            ([machineId, machineRecords]) => (
              <div key={machineId} className="mb-8">
                <h3 className="font-bold text-lg text-blue-800 mb-2">
                  Machine:{" "}
                  {machines.find((m) => m.id === parseInt(machineId))
                    ?.machine_number || `ID ${machineId}`}
                </h3>
                <table className="w-full border text-sm mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Machine No</th>
                      <th className="border p-2">Maintenance Type</th>
                      <th className="border p-2">Part Repaired</th>
                      <th className="border p-2">Maintenance Date</th>
                      <th className="border p-2">Cost</th>
                      <th className="border p-2">Bill</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(machineRecords)}</tbody>
                </table>
              </div>
            )
          )
        )
      ) : (
        <div className="mt-6 text-center text-gray-600 italic">
          {filters.year || filters.month || filters.machine
            ? "No records found for selected filters."
            : "Please select at least a year or machine to view records."}
        </div>
      )}
    </div>
  );
}
