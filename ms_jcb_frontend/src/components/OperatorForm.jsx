import React, { useState } from 'react';
import { createOperator } from '../services/api';

export default function OperatorForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    age: '',
    salary: '',
    photo: null,
    id_proof: null,
    license: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    try {
      await createOperator(data);
      alert('Operator registered!');
      if (typeof onSuccess === 'function') {
        onSuccess();
      }

      setForm({
        name: '',
        address: '',
        age: '',
        salary: '',
        photo: null,
        id_proof: null,
        license: null,
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-8 border border-gray-200 dark:border-gray-700 transition-colors"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-purple-400">
        Operator Registration
      </h2>

      {/* Text Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="e.g. 35"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="salary" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            Monthly Salary (₹)
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            placeholder="e.g. 25000"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>

      {/* File Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <label htmlFor="photo" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            Passport Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <div>
          <label htmlFor="id_proof" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            ID Proof
          </label>
          <input
            type="file"
            id="id_proof"
            name="id_proof"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <div>
          <label htmlFor="license" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
            License
          </label>
          <input
            type="file"
            id="license"
            name="license"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-semibold transition-colors shadow-md"
        >
          Register Operator
        </button>
      </div>
    </form>
  );
}
