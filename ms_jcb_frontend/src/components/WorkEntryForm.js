import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkEntryForm = () => {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    machine: '',
    work_type: '',
    client_name: '',
    client_address: '',
    start_date: '',
    end_date: '',
    total_working_hours: '',
    diesel_used: '',
    rate_per_hour: '',
    commission_based: false,
    commission_amount: '',
    payment_status: 'Pending',
  });

  // Fetch machine list for dropdown
  useEffect(() => {
    axios.get('http://localhost:8000/api/machines/')
      .then(response => {
        setMachines(response.data);
      })
      .catch(error => {
        console.error("Error fetching machines:", error);
      });
  }, []);

  // Auto calculate total amount
  const totalAmount = () => {
    const hours = parseFloat(formData.total_working_hours);
    const rate = parseFloat(formData.rate_per_hour);
    return !isNaN(hours) && !isNaN(rate) ? hours * rate : 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      total_working_hours: parseFloat(formData.total_working_hours),
      diesel_used: parseFloat(formData.diesel_used),
      rate_per_hour: parseFloat(formData.rate_per_hour),
      commission_amount: formData.commission_based ? parseFloat(formData.commission_amount || 0) : 0,
      total_amount: totalAmount()
    };

    axios.post('http://localhost:8000/api/work-entry/', dataToSend)
      .then(res => {
        alert("✅ Work Entry Saved Successfully!");
        setFormData({
          machine: '',
          work_type: '',
          client_name: '',
          client_address: '',
          start_date: '',
          end_date: '',
          total_working_hours: '',
          diesel_used: '',
          rate_per_hour: '',
          commission_based: false,
          commission_amount: '',
          payment_status: 'Pending',
        });
      })
      .catch(err => {
        alert("❌ Error submitting form.");
        console.error("Submission Error:", err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Work Entry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Machine */}
        <div>
          <label className="block font-medium">Machine</label>
          <select name="machine" value={formData.machine} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">--Select Machine--</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.machine_number}
              </option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div>
          <label className="block font-medium">Work Type</label>
          <select name="work_type" value={formData.work_type} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">--Select--</option>
            <option>Plant Work</option>
            <option>Farming Work</option>
            <option>Digging/Loading Soil</option>
            <option>Digging/Loading Sand</option>
            <option>Local Work</option>
            <option>Digging a Drain</option>
          </select>
        </div>

        {/* Client Info */}
        <input type="text" name="client_name" placeholder="Client Name" value={formData.client_name} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />

        <input type="text" name="client_address" placeholder="Client Address" value={formData.client_address} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />

        {/* Work Dates */}
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange}
            className="w-full border rounded px-3 py-2" required />
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}
            className="w-full border rounded px-3 py-2" required />
        </div>

        {/* Hours and Diesel */}
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="total_working_hours" placeholder="Total Working Hours" value={formData.total_working_hours} onChange={handleChange}
            className="w-full border rounded px-3 py-2" required />
          <input type="number" name="diesel_used" placeholder="Diesel Used (Litres)" value={formData.diesel_used} onChange={handleChange}
            className="w-full border rounded px-3 py-2" required />
        </div>

        {/* Rate per Hour */}
        <input type="number" name="rate_per_hour" placeholder="Rate per Hour" value={formData.rate_per_hour} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />

        {/* Total Amount (auto calculated) */}
        <div>
          <label className="block font-medium">Total Amount</label>
          <p className="border bg-gray-100 rounded px-3 py-2">{totalAmount()} ₹</p>
        </div>

        {/* Commission Section */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="commission_based" checked={formData.commission_based} onChange={handleChange} />
          <label>Commission Based?</label>
        </div>

        {formData.commission_based && (
          <input type="number" name="commission_amount" placeholder="Commission Amount" value={formData.commission_amount} onChange={handleChange}
            className="w-full border rounded px-3 py-2" />
        )}

        {/* Payment Status */}
        <div>
          <label className="block font-medium">Payment Status</label>
          <select name="payment_status" value={formData.payment_status} onChange={handleChange}
            className="w-full border rounded px-3 py-2">
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Work Entry
        </button>
      </form>
    </div>
  );
};

export default WorkEntryForm;
