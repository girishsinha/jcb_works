"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const WorkRecordsTable = () => {
  const [records, setRecords] = useState({});
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Please apply filters to see records.');

  const [filters, setFilters] = useState({
    machine: null,
    year: new Date().getFullYear(),
    month: null,
    status: null,
  });

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: y.toString(), value: y };
  });

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'done' },
    { label: 'Pending', value: 'pending' },
  ];

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (filters.machine) {
      fetchData();
    } else {
      setRecords({});
      setMessage('Please select a machine to view records.');
    }
  }, [filters]);

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/machines/');
      setMachines(res.data);
    } catch (err) {
      console.error('Error fetching machines:', err);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.machine) params.append('machine', filters.machine);
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      if (filters.status && filters.status !== 'all') params.append('payment_status', filters.status);

      const res = await axios.get(`http://localhost:8000/api/workrecords/`, {
        params,
      });

      const data = res.data;

      if (!data || data.length === 0) {
        setRecords({});
        setMessage('No records found for selected filters.');
      } else {
        if (filters.month) {
          const monthLabel = months.find(m => m.value === filters.month)?.label;
          setRecords({ [monthLabel]: data });
        } else {
          const grouped = {};
          data.forEach((rec) => {
            const monthName = new Date(rec.start_date).toLocaleString('default', {
              month: 'long',
            });
            if (!grouped[monthName]) grouped[monthName] = [];
            grouped[monthName].push(rec);
          });
          setRecords(grouped);
        }
        setMessage('');
      }
    } catch (err) {
      console.error('Error fetching work records:', err);
      setMessage('Error fetching records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-full">
      <h2 className="text-2xl font-semibold mb-6">Machine Work Records</h2>

      {/* Filter Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Select
          options={machines.map(m => ({ value: m.machine_number, label: m.machine_number }))}
          placeholder="Select Machine"
          onChange={(option) => handleFilterChange('machine', option?.value)}
          isClearable
        />
        <Select
          options={years}
          placeholder="Select Year"
          defaultValue={{ label: filters.year, value: filters.year }}
          onChange={(option) => handleFilterChange('year', option?.value)}
        />
        <Select
          options={months}
          placeholder="Select Month"
          onChange={(option) => handleFilterChange('month', option?.value)}
          isClearable
        />
        <Select
          options={statuses}
          placeholder="Payment Status"
          defaultValue={statuses[0]}
          onChange={(option) => handleFilterChange('status', option?.value)}
        />
      </div>

      {/* Records Table */}
      {isLoading ? (
        <div className="text-center py-10 text-blue-500">Loading records...</div>
      ) : message ? (
        <div className="text-center py-10 text-gray-600">{message}</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-6">
            {Object.entries(records).map(([month, data]) => (
              <div key={month} className="min-w-[750px] bg-white border shadow rounded-lg">
                <h3 className="bg-blue-600 text-white py-2 px-4 text-lg font-medium">{month}</h3>
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Machine</th>
                      <th className="py-2 px-3">Client</th>
                      <th className="py-2 px-3">Start</th>
                      <th className="py-2 px-3">End</th>
                      <th className="py-2 px-3">Hours</th>
                      <th className="py-2 px-3">Diesel</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((rec, i) => (
                      <tr key={rec.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3">{i + 1}</td>
                        <td className="py-2 px-3">{rec.machine_details || rec.machine}</td>
                        <td className="py-2 px-3">{rec.client_name}</td>
                        <td className="py-2 px-3">{rec.start_date}</td>
                        <td className="py-2 px-3">{rec.end_date}</td>
                        <td className="py-2 px-3">{rec.total_hours}</td>
                        <td className="py-2 px-3">{rec.diesel_used} L</td>
                        <td className="py-2 px-3">₹{rec.total_amount}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${rec.payment_status === 'done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {rec.payment_status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkRecordsTable;
