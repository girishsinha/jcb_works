import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginIllustration from '../assets/login-illustration.png';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // ✅ Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // ✅ Set token in Axios instance
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // ✅ Pass tokens to parent
      onLoginSuccess(access, refresh);

      // ✅ Navigate to landing page
      navigate('/landing');
    } catch (err) {
      console.error('Login failed:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Invalid username or password');
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl flex overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Hello, Welcome Back</h1>
            <p className="text-gray-500 mt-2">Hey, welcome back to MS_JCB_Works</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2 accent-purple-500" />
                Remember me
              </label>
              <a href="#" className="text-sm text-purple-600 hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition duration-300"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account? <a href="#" className="text-purple-600 hover:underline">Sign Up</a>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-500 to-indigo-500 items-center justify-center">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-4/5 max-w-md"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
