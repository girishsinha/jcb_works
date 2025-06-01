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
      onSuccess();
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
      className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
        Register Operator
      </h2>

      {['name', 'address', 'age', 'salary'].map((field) => (
        <div key={field} className="mb-4">
          <label
            htmlFor={field}
            className="block mb-1 font-medium text-gray-700 capitalize"
          >
            {field}
          </label>
          <input
            id={field}
            name={field}
            type={field === 'age' || field === 'salary' ? 'number' : 'text'}
            value={form[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      ))}

      {['photo', 'id_proof', 'license'].map((fileField) => (
        <div key={fileField} className="mb-6">
          <label
            htmlFor={fileField}
            className="block mb-1 font-medium text-gray-700 capitalize"
          >
            {fileField.replace('_', ' ')}
          </label>
          <input
            type="file"
            id={fileField}
            name={fileField}
            accept="image/*,.pdf"
            onChange={handleChange}
            className="w-full text-gray-600"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
