import React, { useState, useEffect } from 'react';
import api from '../services/api'; // ✅ Correct path
 // ✅ Import shared axios instance

const WorkEntryForm = () => {
  const [machines, setMachines] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // ✅ Get machine list
    api.get('machines/')
      .then(response => setMachines(response.data))
      .catch(error => console.error("❌ Error fetching machines:", error));

    // ✅ Get user and detect group
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
      .catch(error => {
        console.error("❌ Error fetching user info:", error);
        setUserGroup('Unknown');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = () => {
    const hours = parseFloat(formData.total_working_hours);
    const rate = parseFloat(formData.rate_per_hour);
    return !isNaN(hours) && !isNaN(rate) ? hours * rate : 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

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

    api.post('work-entry/', dataToSend)
      .then(() => {
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

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (userGroup === 'Level_3') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-xl mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold text-red-600">⛔ Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          You do not have permission to access the Entry form.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">📝 Work Entry Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Machine */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Machine</label>
          <select name="machine" value={formData.machine} onChange={handleChange} required
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white">
            <option value="">-- Select Machine --</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.machine_number}
              </option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Work Type</label>
          <select name="work_type" value={formData.work_type} onChange={handleChange} required
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white">
            <option value="">-- Select --</option>
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
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />
        <input type="text" name="client_address" placeholder="Client Address" value={formData.client_address} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />

        {/* Dates */}
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />

        {/* Numbers */}
        <input type="number" name="total_working_hours" placeholder="Total Working Hours" value={formData.total_working_hours} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />
        <input type="number" name="diesel_used" placeholder="Diesel Used (L)" value={formData.diesel_used} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white" required />

        <input type="number" name="rate_per_hour" placeholder="Rate per Hour" value={formData.rate_per_hour} onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white col-span-2" required />

        {/* Total Amount */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Total Amount (₹)</label>
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md border">
            {totalAmount()} ₹
          </div>
        </div>

        {/* Commission */}
        <div className="col-span-2 flex items-center space-x-3">
          <input type="checkbox" name="commission_based" checked={formData.commission_based} onChange={handleChange} />
          <label className="text-sm font-medium">Commission Based?</label>
        </div>

        {formData.commission_based && (
          <input type="number" name="commission_amount" placeholder="Commission Amount" value={formData.commission_amount} onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white col-span-2" />
        )}

        {/* Payment Status */}
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Payment Status</label>
          <select name="payment_status" value={formData.payment_status} onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-700 dark:text-white">
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-4">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-semibold">
            Submit Work Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkEntryForm;
