import React, { useEffect, useState } from "react";
import { getOperators } from "../services/api";
import { useUser } from "../context/UserContext";

export default function OperatorPage() {
  const [operators, setOperators] = useState([]);
  const [viewing, setViewing] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    getOperators()
      .then((res) => {
        setOperators(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Failed to fetch operators:", err));
    console.log(operators);
  }, []);

  return (
    <div className="sm:p-6 space-y-6 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl font-semibold">Operator List</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {operators.map((op) => (
              <tr
                key={op.id}
                className="hover:bg-purple-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 text-sm font-medium flex items-center gap-3">
                  <img
                    src={op.photo || "/default-avatar.png"}
                    alt="Operator"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-left">{op.name}</span>
                </td>
                <td className="px-6 py-4 text-sm">{op.age}</td>
                <td className="px-6 py-4 text-sm">₹{op.salary}</td>
                <td className="px-6 py-4 text-sm">{op.phone || "—"}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setViewing(op)}
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
      {operators.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No operators registered yet.
        </p>
      )}

      {/* Modal Popup */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* Close Button */}
            <button
              onClick={() => setViewing(null)}
              className="absolute top-2 right-3 text-gray-500 dark:text-red-600 hover:text-red-900 text-2xl font-bold transition-transform transform hover:scale-125"
              title="Close"
            >
              ×
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Operator Details
              </h2>
              <div className="mt-2 border-b-2 border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Info Section */}
            <div className="space-y-4 text-sm">
              {[
                ["Name", viewing.name],
                ["Age", viewing.age],
                ["Phone", viewing.phone || "—"],
                ["Salary", `₹${viewing.salary}`],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2"
                >
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {label}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100 text-left w-1/2 truncate">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* 🔰 Documents Row */}
            <div className="mt-6 flex flex-wrap justify-between gap-2">
              {[
                ["Photo", viewing.photo],
                ["ID Proof", viewing.id_proof],
                ["License", viewing.license],
              ].map(([label, url], idx) => (
                <a
                  key={idx}
                  href={url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 text-center py-2 rounded-md font-semibold ${
                    url
                      ? "bg-green-600 text-white hover:bg-green-700 transition"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* 🟣 Edit Button */}
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-sm">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
