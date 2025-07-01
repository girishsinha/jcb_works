"use client";
// // src/pages/MaintenancePage.jsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import MaintenanceForm from '../components/MaintenanceForm'; // Update path if needed
// import MaintenanceList from '../components/MaintenanceList';

// const MaintenancePage = () => {
//   const [records, setRecords] = useState([]);

//   // Function to fetch maintenance records from backend
//   const fetchMaintenanceRecords = async () => {
//     try {
//       const response = await axios.get('/api/maintenance-records/');
//       setRecords(response.data);
//     } catch (error) {
//       console.error('Error fetching maintenance records:', error);
//     }
//   };

//   // Load records when component mounts
//   useEffect(() => {
//     fetchMaintenanceRecords();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       {/* Maintenance Form */}
//       <MaintenanceForm onSuccess={fetchMaintenanceRecords} />

//       <hr className="my-6" />

//       {/* Maintenance List */}
//       <MaintenanceList />
//     </div>
//   );
// };

// export default MaintenancePage;
import React, { useRef, useState, useEffect } from "react";
import MaintenanceForm from "../components/MaintenanceForm";
import MaintenanceList from "../components/MaintenanceList";
import { useTheme } from "../context/ThemeContext";

const MaintenancePage = () => {
  const formRef = useRef(null);
  const listRef = useRef(null);
  const [activeTab, setActiveTab] = useState("form");
  const theme = useTheme();

  const scrollToRef = (ref, tabName) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`${theme.darkMode ? "dark bg-gray-900 " : ""} p-6`}>
      {/* Styled Nav Tabs */}
      <div className="flex gap-8 mb-6">
        <button
          onClick={() => scrollToRef(formRef, "form")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "form"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Add Maintenance
        </button>
        <button
          onClick={() => scrollToRef(listRef, "list")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "list"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 dark:text-white hover:text-blue-600"
          }`}
        >
          View Records
        </button>
      </div>

      {/* Maintenance Form Section */}
      <div ref={formRef} className="flex justify-center">
        <MaintenanceForm onSuccess={() => {}} />
      </div>

      <hr className="my-10" />

      {/* Maintenance List Section */}
      <div ref={listRef}>
        <MaintenanceList />
      </div>
    </div>
  );
};

export default MaintenancePage;
