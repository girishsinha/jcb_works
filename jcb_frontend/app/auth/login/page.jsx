"use client"; // ✅ add this directive to enable client-side rendering
import React, { useState } from "react";
import axios from "axios";

import api from "@/app/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("token", response.data.token);

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      onLoginSuccess(); // Update isLoggedIn state in App

      // ✅ After successful login, navigate to a protected page
      router.push("/landing"); // or '/dashboard' or any default route
    } catch (err) {
      console.error("Login failed:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Invalid username or password");
      } else {
        setError("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <Link href={"/auth/signup"} className="font-bold text-blue-400 p-4">
        if new Signup{" "}
      </Link>
    </div>
  );
};

export default Login;
