// src/components/ActivityLogTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/activity-logs/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
        setFilteredLogs(res.data);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
      }
    };

    fetchLogs();
  }, []);

  const handleFilterChange = e => {
    const keyword = e.target.value.toLowerCase();
    setFilter(keyword);
    const filtered = logs.filter(log =>
      log.user.toLowerCase().includes(keyword) ||
      (log.description && log.description.toLowerCase().includes(keyword))
    );
    setFilteredLogs(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">User Activity Logs</h2>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Search by user or action..."
        className="w-full mb-4 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <div className="overflow-x-auto shadow rounded-md">
        <table className="min-w-full bg-white dark:bg-gray-800 text-sm text-left text-gray-500 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{log.user}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.model_name || '—'}</td>
                  <td className="px-4 py-2">{log.description || '—'}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogTable;
