"use client";
import React, { useEffect, useState } from "react";
import {
  addMaintenance,
  updateMaintenance,
  getMachines,
} from "../services/api";

const maintenanceTypes = [
  "Engine Repair",
  "Hydraulic System",
  "Electrical System",
  "Oil Change",
  "Filter Replacement",
  "Brake System",
  "Tyre Replacement",
  "Paint/Body Work",
  "General Service",
];

export default function MaintenanceForm({ record, onSuccess }) {
  const [machines, setMachines] = useState([]);
  const [hasBill, setHasBill] = useState(false);
  const [form, setForm] = useState({
    machine: "",
    maintenance_type: "",
    part_repaired: "",
    maintenance_date: "",
    description: "",
    cost: "",
    bill_file: null,
  });

  useEffect(() => {
    getMachines()
      .then((res) => setMachines(res.data))
      .catch((err) => console.error("Error fetching machines:", err));
  }, []);

  useEffect(() => {
    if (record) {
      setForm({
        machine: record.machine || "",
        maintenance_type: record.maintenance_type || "",
        part_repaired: record.part_repaired || "",
        maintenance_date: record.maintenance_date || "",
        description: record.description || "",
        cost: record.cost || "",
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
      if (k !== "bill_file" && v !== null && v !== "") {
        data.append(k, v);
      }
    });

    // Append bill_file only if hasBill is true and file is selected
    if (hasBill && form.bill_file) {
      data.append("bill_file", form.bill_file);
    }

    try {
      if (record) {
        await updateMaintenance(record.id, data);
        alert("Maintenance record updated.");
      } else {
        await addMaintenance(data);
        alert("Maintenance record added.");
      }

      onSuccess();
      setForm({
        machine: "",
        maintenance_type: "",
        part_repaired: "",
        maintenance_date: "",
        description: "",
        cost: "",
        bill_file: null,
      });
      setHasBill(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-1/2">
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2 dark:text-white">
          {record ? "Edit" : "Add"} Maintenance
        </h2>

        <select
          name="machine"
          value={form.machine}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select Machine</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.machine_number}
            </option>
          ))}
        </select>

        <select
          name="maintenance_type"
          value={form.maintenance_type}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Maintenance Type</option>
          {maintenanceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="part_repaired"
          value={form.part_repaired}
          onChange={handleChange}
          placeholder="Part Repaired"
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <input
          type="date"
          name="maintenance_date"
          value={form.maintenance_date}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div class="mb-6 ">
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <input
          type="number"
          name="cost"
          value={form.cost}
          onChange={handleChange}
          placeholder="Total Cost (₹)"
          required
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        {/* Bill Checkbox */}

        <div className="flex items-start mb-6 space-x-2">
          <div className="flex items-center h-5">
            <input
              id="billAvailable"
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              type="checkbox"
              checked={hasBill}
              onChange={(e) => setHasBill(e.target.checked)}
            />
          </div>
          <label
            for="billAvailable"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Bill Available?
          </label>
        </div>

        {/* Conditionally show file input */}
        {hasBill && (
          <div className="flex flex-col items-start mb-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              Upload file
            </label>
            <input
              type="file"
              name="bill_file"
              onChange={handleChange}
              className=" block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
            />
          </div>
        )}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {record ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
