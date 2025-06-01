import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import your components and pages
import MachineList from './components/MachineList';
import WorkEntryForm from './components/WorkEntryForm';
import WorkRecordsTable from './components/WorkRecordsTable';
import YearlyOverviewChart from './components/YearlyOverviewChart';
import MonthlyDieselGraph from './components/MonthlyDieselGraph';
import OperatorPage from './pages/OperatorPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';

import api from './services/api';

// ✅ Import UserProvider
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check token and set Axios default headers on app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('App.js: Token found on load, user is logged in.');
    } else {
      console.log('App.js: No token found, user is NOT logged in.');
    }

    // ✅ Backend connection test (good for dev)
    fetch('http://127.0.0.1:8000/api/test/')
      .then(response => {
        if (!response.ok) throw new Error('Failed to connect');
        return response.text();
      })
      .then(data => console.log("Connected to Django:", data))
      .catch(error => console.error("Backend error:", error));
  }, []);

  // ✅ After login, store token and set login state
  const handleLoginSuccess = (token) => {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
    console.log('App.js: handleLoginSuccess - logged in successfully.');
  };

  // ✅ Logout: clear token and login state
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    delete api.defaults.headers.common['Authorization'];
    console.log('App.js: handleLogout - logged out successfully.');
  };

  console.log('App.js: isLoggedIn =', isLoggedIn);

  return (
    <UserProvider>
      <Router>
        <div className="App">
          {/* Example: Add <Navbar onLogout={handleLogout} /> here if needed */}

          <Routes>
            {/* Public: Login */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

            {/* Protected routes: only if logged in */}
            <Route path="/landing" element={isLoggedIn ? <LandingPage /> : <Navigate to="/login" replace />} />
            <Route path="/operators" element={isLoggedIn ? <OperatorPage /> : <Navigate to="/login" replace />} />
            <Route path="/work-entry" element={isLoggedIn ? <WorkEntryForm /> : <Navigate to="/login" replace />} />
            <Route path="/machines" element={isLoggedIn ? <MachineList /> : <Navigate to="/login" replace />} />
            <Route path="/work-records" element={isLoggedIn ? <WorkRecordsTable /> : <Navigate to="/login" replace />} />
            <Route path="/yearly-overview" element={isLoggedIn ? <YearlyOverviewChart /> : <Navigate to="/login" replace />} />
            <Route path="/monthly-diesel" element={isLoggedIn ? <MonthlyDieselGraph /> : <Navigate to="/login" replace />} />

            {/* Default root */}
            <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
