import React, { useState } from 'react';
import { registerUser } from '../services/api'; // ✅ Adjust path if needed

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    authority_level: '',
  });

  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);

  const authorityOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Staff' },
    { value: 3, label: 'Worker' },
  ];

  const groupMap = {
    1: 'Level_1_Owner_admin',
    2: 'Level_2_Staff_',
    3: 'Level_3_Employee_operator',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'authority_level' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorDetails(null);

    if (!formData.authority_level || !groupMap[formData.authority_level]) {
      setMessage('❌ Please select a valid user role.');
      return;
    }

    const payload = {
      ...formData,
      group: groupMap[formData.authority_level],
    };

    try {
      const res = await registerUser(payload); // ✅ Uses api.js

      setMessage(`✅ User "${res.data.username}" registered successfully!`);
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        authority_level: '',
      });
    } catch (err) {
      console.error(err);
      const details =
        err.response?.data &&
        Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n');

      setErrorDetails(details || 'An unexpected error occurred.');
      setMessage('❌ Registration failed. Please check the inputs or permissions.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Register New User
      </h2>

      {message && <p className="text-sm text-green-500 mb-3">{message}</p>}
      {errorDetails && (
        <pre className="text-xs text-red-500 mb-3 whitespace-pre-wrap">{errorDetails}</pre>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <select
          name="authority_level"
          value={formData.authority_level}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">-- Select Role --</option>
          {authorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {formData.authority_level && (
          <p className="text-xs text-gray-500">
            Assigned Group: <b>{groupMap[formData.authority_level]}</b>
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
