import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

const WorkRecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({
    machine: '',
    payment_status: '',
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    fetchMachines();
    fetchFilteredData(); // Load initial records
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/machines/');
      setMachines(res.data);
    } catch (err) {
      console.error('Error fetching machines:', err);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.machine) params.append('machine__machine_number', filters.machine);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (filters.start_date) params.append('work_start_date', filters.start_date.toISOString().split('T')[0]);
      if (filters.end_date) params.append('work_end_date', filters.end_date.toISOString().split('T')[0]);

      const res = await axios.get(`http://localhost:8000/api/workrecords/?${params.toString()}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching filtered work records:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Work Records</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select
          options={machines.map(m => ({ value: m.machine_number, label: m.machine_number }))}
          placeholder="Select Machine"
          onChange={(option) => setFilters({ ...filters, machine: option?.value })}
          isClearable
        />
        <Select
          options={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Done', value: 'Done' },
          ]}
          placeholder="Payment Status"
          onChange={(option) => setFilters({ ...filters, payment_status: option?.value })}
          isClearable
        />
        <DatePicker
          selected={filters.start_date}
          onChange={(date) => setFilters({ ...filters, start_date: date })}
          placeholderText="Start Date"
          className="p-2 border rounded w-full"
        />
        <DatePicker
          selected={filters.end_date}
          onChange={(date) => setFilters({ ...filters, end_date: date })}
          placeholderText="End Date"
          className="p-2 border rounded w-full"
        />
      </div>

      <button
        onClick={fetchFilteredData}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Machine</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Start Date</th>
              <th className="py-2 px-4">End Date</th>
              <th className="py-2 px-4">Hours</th>
              <th className="py-2 px-4">Diesel</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">No records found</td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{record.machine_details?.machine_number}</td>
                  <td className="py-2 px-4">{record.client_name}</td>
                  <td className="py-2 px-4">{record.start_date}</td>
                  <td className="py-2 px-4">{record.end_date}</td>
                  <td className="py-2 px-4">{record.total_hours}</td>
                  <td className="py-2 px-4">{record.diesel_used} L</td>
                  <td className="py-2 px-4">₹{record.total_amount}</td>
                  <td className="py-2 px-4">{record.payment_status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkRecordsTable;
