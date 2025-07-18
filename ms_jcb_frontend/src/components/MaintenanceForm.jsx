import React, { useEffect, useState } from 'react';
import { addMaintenance, updateMaintenance, getMachines } from '../services/api';
import api from '../services/api'; // ✅ Reusing axios instance for user info

const maintenanceTypes = [
  'Engine Repair', 'Hydraulic System', 'Electrical System',
  'Oil Change', 'Filter Replacement', 'Brake System',
  'Tyre Replacement', 'Paint/Body Work', 'General Service',
];

export default function MaintenanceForm({ record, onSuccess }) {
  const [machines, setMachines] = useState([]);
  const [hasBill, setHasBill] = useState(false);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    machine: '',
    maintenance_type: '',
    part_repaired: '',
    maintenance_date: '',
    description: '',
    cost: '',
    bill_file: null,
  });

  // ✅ Fetch user group
  useEffect(() => {
    api.get('user/')
      .then(response => {
        const groups = response.data.groups || [];
        if (groups.includes('Level_1_Owner_admin')) {
          setUserGroup('Level_1');
        } else if (groups.includes('Level_2_Staff_')) {
          setUserGroup('Level_2');
        } else if (groups.includes('Level_3_Employee_operator')) {
          setUserGroup('Level_3');
        } else {
          setUserGroup('Unknown');
        }
      })
      .catch(err => {
        console.error('❌ Error fetching user info:', err);
        setUserGroup('Unknown');
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Fetch machines
  useEffect(() => {
    getMachines()
      .then(res => setMachines(res.data))
      .catch(err => console.error("Error fetching machines:", err));
  }, []);

  // ✅ Populate form when editing
  useEffect(() => {
    if (record) {
      setForm({
        machine: record.machine || '',
        maintenance_type: record.maintenance_type || '',
        part_repaired: record.part_repaired || '',
        maintenance_date: record.maintenance_date || '',
        description: record.description || '',
        cost: record.cost || '',
        bill_file: null,
      });
      setHasBill(!!record.bill_file);
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'bill_file' && v !== null && v !== '') {
        data.append(k, v);
      }
    });

    if (hasBill && form.bill_file) {
      data.append('bill_file', form.bill_file);
    }

    try {
      if (record) {
        await updateMaintenance(record.id, data);
        alert('Maintenance record updated.');
      } else {
        await addMaintenance(data);
        alert('Maintenance record added.');
      }

      setForm({
        machine: '', maintenance_type: '', part_repaired: '',
        maintenance_date: '', description: '', cost: '', bill_file: null
      });
      setHasBill(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  // ⛔ Restrict Level 3 users
  if (userGroup === 'Level_3') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-xl mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold text-red-600">⛔ Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          You do not have permission to access the maintenance form.
        </p>
      </div>
    );
  }

  // ✅ Render full form for Level 1 & 2 users
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        {record ? 'Edit' : 'Add'} Maintenance
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Machine Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Machine
          </label>
          <select
            name="machine"
            value={form.machine}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Machine</option>
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.machine_number}</option>
            ))}
          </select>
        </div>

        {/* Maintenance Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Maintenance Type
          </label>
          <select
            name="maintenance_type"
            value={form.maintenance_type}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            {maintenanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Part Repaired */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Part Repaired
          </label>
          <input
            type="text"
            name="part_repaired"
            value={form.part_repaired}
            onChange={handleChange}
            required
            placeholder="E.g., Fuel Pump"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Maintenance Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Maintenance Date
          </label>
          <input
            type="date"
            name="maintenance_date"
            value={form.maintenance_date}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Describe the maintenance work done..."
            rows={4}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cost (₹)
          </label>
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            required
            placeholder="0.00"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bill Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasBill}
            onChange={(e) => setHasBill(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bill Available?
          </label>
        </div>

        {/* File Upload */}
        {hasBill && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Bill
            </label>
            <input
              type="file"
              name="bill_file"
              onChange={handleChange}
              className="w-full text-gray-800 dark:text-gray-100"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
        >
          {record ? 'Update' : 'Add'} Maintenance
        </button>
      </div>
    </form>
  );
}
