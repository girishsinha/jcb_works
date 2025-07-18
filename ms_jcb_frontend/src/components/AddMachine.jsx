import React, { useState } from 'react';
import { createMachine } from '../services/api'; // adjust path if needed

const AddMachineForm = () => {
  const [formData, setFormData] = useState({});
  //const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    try {
      await createMachine(form);
      alert('✅ Machine Submitted Successfully');
      setFormData({});
      e.target.reset();
    } catch (error) {
      console.error('❌ Machine submission failed:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-2 py-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-md">

        <div className="bg-purple-700 px-6 py-3 rounded-t-md">
          <h2 className="text-xl font-semibold text-white text-left">
            Machine Registration Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-8">

          <FormSection index="1" title="Basic Machine Information">
            <Grid>
              <Input name="machine_number" label="Machine Number" placeholder="e.g., MH12AB1234" onChange={handleChange} />
              <Select name="machine_type" label="Machine Type" options={['JCB 3DX', 'Excavator', 'Loader']} onChange={handleChange} />
              <Select name="manufacturer" label="Manufacturer" options={['JCB', 'Tata Hitachi', 'Caterpillar']} onChange={handleChange} />
              <Input name="model_name" label="Model Name" placeholder="e.g., 3DX-220LC" onChange={handleChange} />
              <Input name="manufacturing_year" label="Manufacturing Year" type="number" placeholder="e.g., 2022" onChange={handleChange} />
              <Input name="engine_number" label="Engine Number" placeholder="Enter engine no." onChange={handleChange} />
              <Input name="chassis_number" label="Chassis Number" placeholder="Enter chassis no." onChange={handleChange} />
            </Grid>
          </FormSection>

          <FormSection index="2" title="Ownership & Insurance">
            <Grid>
              <Input name="owner_name" label="Owner Name" placeholder="Full name" onChange={handleChange} />
              <Input name="owner_contact" label="Owner Contact" placeholder="Phone number" onChange={handleChange} />
              <Textarea name="owner_address" label="Owner Address" placeholder="Street, City, State" onChange={handleChange} />
              <Input name="insurance_provider" label="Insurance Provider" placeholder="e.g., ICICI, HDFC" onChange={handleChange} />
              <Input name="insurance_policy_no" label="Policy Number" placeholder="Enter policy number" onChange={handleChange} />
              <Input name="insurance_expiry" label="Insurance Expiry Date" type="date" onChange={handleChange} />
            </Grid>
          </FormSection>

          <FormSection index="3" title="Legal Documents">
            <Grid>
              <Input name="rc_book_no" label="RC Book Number" placeholder="Enter RC number" onChange={handleChange} />
              <Input name="pollution_cert_no" label="Pollution Cert No." placeholder="Certificate number" onChange={handleChange} />
              <Input name="pollution_expiry" label="Pollution Expiry" type="date" onChange={handleChange} />
              <Input name="fitness_cert_no" label="Fitness Cert No." placeholder="Certificate number" onChange={handleChange} />
              <Input name="fitness_expiry" label="Fitness Expiry" type="date" onChange={handleChange} />
              <Input name="road_tax_validity" label="Road Tax Validity" type="date" onChange={handleChange} />
              <Select name="permit_type" label="Permit Type" options={['National', 'State', 'Contract Carriage']} onChange={handleChange} />
              <Input name="permit_expiry" label="Permit Expiry" type="date" onChange={handleChange} />
            </Grid>
          </FormSection>

          <FormSection index="4" title="Operational Details">
            <Grid>
              <Select name="status" label="Machine Status" options={['Active', 'Under Maintenance', 'Inactive']} onChange={handleChange} />
              <Input name="assigned_site" label="Assigned Site" placeholder="Site/Area name" onChange={handleChange} />
              <Select name="fuel_type" label="Fuel Type" options={['Diesel', 'Petrol']} onChange={handleChange} />
              <Input name="fuel_capacity" label="Fuel Capacity (L)" type="number" placeholder="e.g., 250" onChange={handleChange} />
              <Input name="fuel_consumption" label="Avg. Fuel Consumption (L/hr)" type="number" placeholder="e.g., 15" onChange={handleChange} />
              <Input name="working_hours" label="Total Working Hours" type="number" placeholder="e.g., 1200" onChange={handleChange} />
            </Grid>
          </FormSection>

          <FormSection index="5" title="Upload Documents">
            <Grid>
              <FileInput name="ownerId" label="Owner ID" onChange={handleChange} />
              <FileInput name="rc_upload" label="RC Upload" onChange={handleChange} />
              <FileInput name="insurance_copy" label="Insurance Copy" onChange={handleChange} />
              <FileInput name="fitness_cert" label="Fitness Certificate" onChange={handleChange} />
              <FileInput name="pollution_cert" label="Pollution Certificate" onChange={handleChange} />
              <FileInput name="permit_doc" label="Permit Document" onChange={handleChange} />
              <FileInput name="owner_photo_id" label="Owner Photo ID" onChange={handleChange} />
              <FileInput name="machine_photo" label="Machine Photo" onChange={handleChange} />
            </Grid>
          </FormSection>

          <div className="mt-8 text-right">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-md">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

/* Subcomponents */

const FormSection = ({ index, title, children }) => (
  <div className="space-y-4">
    <hr className="border-gray-300 dark:border-gray-700" />
    <h3 className="text-md font-semibold text-left text-gray-800 dark:text-white mt-4 mb-2">{index}. {title}</h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
);

const Input = ({ name, label, type = 'text', placeholder = '', onChange }) => (
  <div className="flex flex-col items-start">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full text-left placeholder:text-left px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);


const Textarea = ({ name, label, placeholder = '', onChange }) => (
  <div className="flex flex-col items-start sm:col-span-2 lg:col-span-3">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      rows={2}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full text-left placeholder:text-left px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);


const Select = ({ name, label, options, onChange }) => (
  <div className="flex flex-col items-start">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      name={name}
      onChange={onChange}
      className="w-full text-left px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const FileInput = ({ name, label, onChange }) => (
  <div className="flex flex-col items-start">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-purple-100 dark:file:bg-purple-900 file:text-purple-700 dark:file:text-purple-200 hover:file:bg-purple-200 dark:hover:file:bg-purple-800"
    />
  </div>
);

export default AddMachineForm;
