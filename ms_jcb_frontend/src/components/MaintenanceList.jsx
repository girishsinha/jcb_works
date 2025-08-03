import React, { useEffect, useState } from "react";
import { getMaintenance, getMachines } from "../services/api";

const userAuthorityLevel = 2;

export default function MaintenanceList() {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({ machine: "", month: "", year: "" });
  const [viewing, setViewing] = useState(null);

  const loadRecords = () => {
    const query = Object.entries(filters)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k === "machine" ? "machine_id" : k}=${v}`)
      .join("&");

    getMaintenance(query)
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]));
  };

  useEffect(() => {
    getMachines().then((res) => setMachines(res.data));
  }, []);
  useEffect(() => {
    loadRecords();
  }, [filters]);

  return (
    <div className="sm:p-6 space-y-6 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl font-semibold">Maintenance Records</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600"
          value={filters.machine}
          onChange={(e) => setFilters({ ...filters, machine: e.target.value })}
        >
          <option value="">All Machines</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.machine_number}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "short" })}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {[...Array(6)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-sm font-medium">
                Machine
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Cost</th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Bill
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {records.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-purple-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 text-sm">
                  {machines.find((m) => m.id === r.machine)?.machine_number ||
                    r.machine}
                </td>
                <td className="px-6 py-4 text-sm text-left">
                  {r.maintenance_type}
                </td>
                <td className="px-6 py-4 text-sm">{r.maintenance_date}</td>
                <td className="px-6 py-4 text-sm text-right">₹{r.cost}</td>
                <td className="px-6 py-4 text-center text-sm">
                  {r.bill_file ? (
                    <a
                      href={r.bill_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">Unavailable</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setViewing(r)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Records Message */}
      {records.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 italic">
          {filters.machine || filters.month || filters.year
            ? "No matching records."
            : "Please apply filters to view records."}
        </p>
      )}

      {/* Popup Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* 🔺 Top-Right Large Close Button */}
            <button
              onClick={() => setViewing(null)}
              className="absolute top-0.5 right-3 text-gray-500 dark:text-red-600 hover:text-red-900 text-2xl font-bold transition-transform transform hover:scale-125"
              title="Close"
            >
              ×
            </button>

            {/* 🟢 Title with Divider */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Maintenance Details
              </h2>
              <div className="mt-2 border-b-2 border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* 📋 Form-Like Info Grid */}
            {/* 📋 Field Layout */}
            <div className="space-y-4 text-sm">
              {[
                [
                  "Machine",
                  machines.find((m) => m.id === viewing.machine)
                    ?.machine_number || "—",
                ],
                ["Maintenance Type", viewing.maintenance_type],
                ["Part Repaired", viewing.part_repaired || "—"],
                ["Date", viewing.maintenance_date],
                ["Cost", `₹${viewing.cost}`],
                [
                  "Bill",
                  viewing.bill_file ? (
                    <a
                      href={viewing.bill_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-red-800"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">
                      Unavailable
                    </span>
                  ),
                ],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2"
                >
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {label}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100 text-left w-1/2">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ✏️ Edit Button (Centered) */}
            {userAuthorityLevel <= 2 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-green-700 shadow-sm">
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
