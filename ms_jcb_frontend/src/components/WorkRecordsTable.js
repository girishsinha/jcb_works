import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';
import { MdFilterList } from 'react-icons/md';
import api from '../services/api'; 

const WorkRecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({
    machine: '',
    payment_status: '',
    month: '',
    year: '',
    search: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchMachines();
    fetchAllRecords();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      applyFilters();
    }, 500); // Wait 500ms after typing

    return () => clearTimeout(delayDebounce);
  }, [filters.search]);


  const fetchMachines = async () => {
  try {
    const res = await api.get('machines/');
    setMachines(res.data);
  } catch (err) {
    console.error('Error fetching machines:', err);
  }
};

const fetchAllRecords = async () => {
  try {
    const res = await api.get('workrecords/');
    const sorted = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    setRecords(sorted);
  } catch (err) {
    console.error('Error fetching work records:', err);
  }
};

const applyFilters = async () => {
  try {
    const params = new URLSearchParams();
    if (filters.machine) params.append('machine', filters.machine);
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    if (filters.search) params.append('search', filters.search);

    params.append('ordering', '-start_date');
    const res = await api.get(`workrecords/?${params.toString()}`);
    const sorted = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    setRecords(sorted);
    setCurrentPage(1);
  } catch (err) {
    console.error('Error applying filters:', err);
  }
};

  const selectStyles = {
  control: (base, state) => ({
    ...base,
    width: 140,
    minHeight: 34,
    fontSize: 13,
    borderRadius: 6,
    border: '1px solid #9ca3af', // neutral gray border
    backgroundColor: '#f3f4f6',  // light gray for light theme, still readable in dark
    boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
    '&:hover': {
      borderColor: '#6366f1',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#111827',  // near-black, visible in both themes
    fontWeight: '500',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#6b7280',  // soft gray, readable in both
    fontSize: 12,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? '#4f46e5' // indigo-600
      : isFocused
      ? '#e5e7eb' // gray-200
      : '#f9fafb', // gray-50
    color: isSelected ? '#ffffff' : '#111827',
    fontSize: 13,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#f9fafb',  // gray-50
    zIndex: 999,
    border: '1px solid #d1d5db',
  }),
  input: (base) => ({
    ...base,
    color: '#111827', // dark gray
    padding: 0,
    margin: 0,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 2,
    color: '#4b5563',  // neutral
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 2,
    color: '#4b5563',
  }),
};


  const months = [...Array(12)].map((_, i) => ({
    label: new Date(0, i).toLocaleString('default', { month: 'short' }),
    value: i + 1,
  }));

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: `${year}`, value: year };
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  useEffect(() => {
    if (filters.month && !filters.year) {
      alert('Please select a year along with the month to filter records.');
    }
  }, [filters.month]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-[140px]">
              <Select
                placeholder="Machine"
                options={machines.map((m) => ({ label: m.machine_number, value: m.id }))}
                onChange={(option) => setFilters({ ...filters, machine: option?.value || '' })}
                isClearable
                styles={selectStyles}
              />
            </div>
            <div className="w-[140px]">
              <Select
                placeholder="Status"
                options={[
                  { label: 'Done', value: 'Done' },
                  { label: 'Pending', value: 'Pending' },
                ]}
                onChange={(option) => setFilters({ ...filters, payment_status: option?.value || '' })}
                isClearable
                styles={selectStyles}
              />
            </div>
            <div className="w-[140px]">
              <Select
                placeholder="Month"
                options={months}
                onChange={(option) => setFilters({ ...filters, month: option?.value || '' })}
                isClearable
                styles={selectStyles}
              />
            </div>
            <div className="w-[140px]">
              <Select
                placeholder="Year"
                options={years}
                onChange={(option) => setFilters({ ...filters, year: option?.value || '' })}
                isClearable
                styles={selectStyles}
              />
            </div>
            <button
              onClick={applyFilters}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              title="Apply Filters"
            >
              <MdFilterList size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center border rounded px-2 py-1 bg-white dark:bg-gray-700">
            <input
              type="text"
              placeholder="Search Client..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyFilters();  // <== Added
              }}
              className="text-sm bg-transparent outline-none w-32 dark:text-white"
            />
            <button
              onClick={applyFilters}
              title="Search"
              className="ml-1"
            >
              <FiSearch size={16} className="text-gray-500 dark:text-gray-300" />
            </button>
          </div>
          
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Machine</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Hours</th>
                <th className="px-4 py-2">Diesel</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-2 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-gray-500 py-6">
                    No records found
                  </td>
                </tr>
              ) : (
                currentRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{indexOfFirstRecord + index + 1}</td>
                    <td className="px-4 py-2">{record.machine_details?.machine_number || 'N/A'}</td>
                    <td className="px-4 py-2">{record.client_name}</td>
                    <td className="px-4 py-2">{record.start_date}</td>
                    <td className="px-4 py-2">{record.end_date}</td>
                    <td className="px-4 py-2">{record.total_hours}</td>
                    <td className="px-4 py-2">{record.diesel_used} L</td>
                    <td className="px-4 py-2 text-green-700 dark:text-green-400 font-semibold">₹{record.total_amount}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          record.payment_status === 'Done'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-300 text-yellow-900'
                        }`}
                      >
                        {record.payment_status}
                      </span>
                    </td>
                    <td className="px-2 text-right">
                      <button>
                        <FiMoreVertical className="text-gray-600 dark:text-gray-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkRecordsTable;
 