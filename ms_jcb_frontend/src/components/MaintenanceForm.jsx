import React, { useEffect, useState } from 'react';
import { addMaintenance, updateMaintenance, getMachines } from '../services/api';

const maintenanceTypes = [
  'Engine Repair', 'Hydraulic System', 'Electrical System',
  'Oil Change', 'Filter Replacement', 'Brake System',
  'Tyre Replacement', 'Paint/Body Work', 'General Service',
];

export default function MaintenanceForm({ record, onSuccess }) {
  const [machines, setMachines] = useState([]);
  const [hasBill, setHasBill] = useState(false);
  const [form, setForm] = useState({
    machine: '',
    maintenance_type: '',
    part_repaired: '',
    maintenance_date: '',
    description: '',
    cost: '',
    bill_file: null,
  });

  useEffect(() => {
    getMachines()
      .then(res => setMachines(res.data))
      .catch(err => console.error("Error fetching machines:", err));
  }, []);

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
      setHasBill(!!record.bill_file); // or false if you want default
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append fields except bill_file
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'bill_file' && v !== null && v !== '') {
        data.append(k, v);
      }
    });

    // Append bill_file only if hasBill is true and file is selected
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

      onSuccess();
      setForm({
        machine: '', maintenance_type: '', part_repaired: '',
        maintenance_date: '', description: '', cost: '', bill_file: null
      });
      setHasBill(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded grid gap-4 sm:grid-cols-2">
      <h2 className="text-lg font-semibold sm:col-span-2">{record ? 'Edit' : 'Add'} Maintenance</h2>

      <select name="machine" value={form.machine} onChange={handleChange} required className="p-2 border rounded w-full">
        <option value="">Select Machine</option>
        {machines.map(m => (
          <option key={m.id} value={m.id}>{m.machine_number}</option>
        ))}
      </select>

      <select name="maintenance_type" value={form.maintenance_type} onChange={handleChange} required className="p-2 border rounded w-full">
        <option value="">Maintenance Type</option>
        {maintenanceTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input
        type="text"
        name="part_repaired"
        value={form.part_repaired}
        onChange={handleChange}
        placeholder="Part Repaired"
        required
        className="p-2 border rounded w-full"
      />

      <input
        type="date"
        name="maintenance_date"
        value={form.maintenance_date}
        onChange={handleChange}
        required
        className="p-2 border rounded w-full"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="p-2 border rounded sm:col-span-2"
      />

      <input
        type="number"
        name="cost"
        value={form.cost}
        onChange={handleChange}
        placeholder="Total Cost (₹)"
        required
        className="p-2 border rounded w-full"
      />

      {/* Bill Checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={hasBill}
          onChange={(e) => setHasBill(e.target.checked)}
        />
        <span>Bill Available?</span>
      </label>

      {/* Conditionally show file input */}
      {hasBill && (
        <input
          type="file"
          name="bill_file"
          onChange={handleChange}
          className="w-full"
        />
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded sm:col-span-2">
        {record ? 'Update' : 'Add'}
      </button>
    </form>
  );
}
