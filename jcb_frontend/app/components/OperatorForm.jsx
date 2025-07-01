"use client";
import React, { useState } from "react";
import { createOperator } from "../services/api";

export default function OperatorForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    age: "",
    salary: "",
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
      alert("Operator registered!");
      onSuccess();
      setForm({
        name: "",
        address: "",
        age: "",
        salary: "",
        photo: null,
        id_proof: null,
        license: null,
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 w-full md:w-1/2 mx-auto"
      encType="multipart/form-data"
    >
      <h2 className="text-lg font-semibold sm:col-span-2 dark:text-white mb-4">
        Register Operator
      </h2>

      {["name", "address", "age", "salary"].map((field) => (
        <div key={field} className="mb-4">
          <label
            htmlFor={field}
            className="ms-2 font-medium text-gray-700 dark:text-gray-300 capitalize"
          >
            {field}
          </label>
          <input
            id={field}
            name={field}
            type={field === "age" || field === "salary" ? "number" : "text"}
            value={form[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
      ))}

      {["photo", "id_proof", "license"].map((fileField) => (
        <div key={fileField} className="mb-6">
          <label
            htmlFor={fileField}
            className="ms-2 font-medium text-gray-700 dark:text-gray-300 capitalize"
          >
            {fileField.replace("_", " ")}
          </label>
          <input
            type="file"
            id={fileField}
            name={fileField}
            accept="image/*,.pdf"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      ))}

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
}
