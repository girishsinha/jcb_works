import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';

import { FaXmark } from "react-icons/fa6";
import { FaStream } from "react-icons/fa";
// Pages & Components
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import OperatorPage from './components/OperatorPage';
import WorkEntryForm from './components/WorkEntryForm';
import WorkRecordsTable from './components/WorkRecordsTable';
import OperatorForm from './components/OperatorForm';
import SalaryTracker from "./components/SalaryTracker";
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import AddMachine from "./components/AddMachine";
import ViewMachine from "./components/ViewMachine";
import UserRegistrationForm from "./components/UserRegistrationForm";
import ActivityLogTable from "./components/ActivityLogTable";

import { useUser } from './context/UserContext';
// API and Context
import api from './services/api';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // ✅ Store user info
  const [navToggle, setNavToggle] = useState(false);
  const contextuser = useUser();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Verify token first
      axios
        .post('http://127.0.0.1:8000/api/token/verify/', { token })
        .then(() => {
          console.log('✅ Token is valid.');
          setIsLoggedIn(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // ✅ Fetch user details
          axios
            .get('http://127.0.0.1:8000/api/user/', {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              setUserInfo(res.data);
              contextuser.setUser();
              console.log('👤 User info loaded:', res.data);
            })
            .catch((err) => {
              console.warn('❌ Failed to fetch user info:', err);
              setUserInfo(null);
            });
        })
        .catch((err) => {
          console.warn('❌ Invalid token. Logging out.', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          setUserInfo(null);
        })
        .finally(() => setLoading(false));
    } else {
      console.warn('🚫 No token found. Redirecting to login.');
      setIsLoggedIn(false);
      setLoading(false);
    }

    // Optional backend connection test
    fetch('http://127.0.0.1:8000/api/test/')
      .then((res) => res.text())
      .then((data) => console.log('✅ Backend test success:', data))
      .catch((err) => console.error('❌ Backend test failed:', err));
  }, []);

  const handleLoginSuccess = (accessToken, refreshToken) => {
    // Save tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setIsLoggedIn(true);

    // Fetch user info after login
    axios
      .get('http://127.0.0.1:8000/api/user/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setUserInfo(res.data);
        console.log('👤 User info loaded after login:', res.data);
      })
      .catch((err) => {
        console.warn('❌ Failed to fetch user info after login:', err);
        setUserInfo(null);
      });

    console.log('✅ Login successful.');
  };


  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setUserInfo(null);
    console.log('👋 Logged out.');
  };



  if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <button className='z-50 fixed top-4 left-4 sm:hidden block' onClick={() => { setNavToggle(!navToggle) }}>{
            navToggle ? <FaXmark className='text-2xl' /> : <FaStream className='text-2xl' />}</button>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

            {/* Private Routes */}
            <Route path="/landing" element={isLoggedIn ? <LandingPage user={userInfo} navtoggle={navToggle} setNavToggle={setNavToggle} /> : <Navigate to="/login" replace />} />
            <Route path="/operator-page" element={isLoggedIn ? <OperatorPage /> : <Navigate to="/login" replace />} />
            <Route path="/work-entry" element={isLoggedIn ? <WorkEntryForm /> : <Navigate to="/login" replace />} />
            <Route path="/work-records" element={isLoggedIn ? <WorkRecordsTable /> : <Navigate to="/login" replace />} />
            <Route path="/operator-form" element={isLoggedIn ? <OperatorForm /> : <Navigate to="/login" replace />} />
            <Route path="/salary-tracker" element={isLoggedIn ? <SalaryTracker /> : <Navigate to="/login" replace />} />
            <Route path="/maintenance-form" element={isLoggedIn ? <MaintenanceForm /> : <Navigate to="/login" replace />} />
            <Route path="/maintenance-list" element={isLoggedIn ? <MaintenanceList /> : <Navigate to="/login" replace />} />
            <Route path="/add-machine" element={isLoggedIn ? <AddMachine /> : <Navigate to="/login" replace />} />
            <Route path="/view-machine" element={isLoggedIn ? <ViewMachine /> : <Navigate to="/login" replace />} />
            <Route path="/user-registration" element={isLoggedIn ? <UserRegistrationForm /> : <Navigate to="/login" replace />} />
            <Route path="/user-activity" element={isLoggedIn ? <ActivityLogTable /> : <Navigate to="/login" replace />} />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
