"use client";
import React, { useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
import defaultProfile from "./assets/defaultProfile.jpg";

import OperatorPage from "./Operator/page";
import WorkEntryRecordPage from "./Work-entry/page";
import MaintenancePage from "./Maintenance/page"; // ✅ Import MaintenancePage

import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from 'next/navigation'

export default function Home({ user = { name: "Vikash Yadu", profilePic: null } }) {

  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter()

  // ✅ Refs for scrollable sections
  const workEntryRef = useRef(null);
  const maintenanceRef = useRef(null);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ✅ Smooth scroll handlers
  const scrollToWorkEntry = () => {
    if (workEntryRef.current) {
      workEntryRef.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const scrollToMaintenance = () => {
    if (maintenanceRef.current) {
      maintenanceRef.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };
  const theme = useTheme();
  console.log(theme)

  return (
    <div className={`${theme.darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 overflow-y-auto scroll-smooth">

        {/* <nav className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-gray-800">
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <a href="#home" className="hover:text-yellow-500">
                🏠 {t("home")}
              </a>
              <a href="#dashboard" className="hover:text-yellow-500">
                📊 {t("dashboard")}
              </a>
              <button
                onClick={scrollToWorkEntry}
                className="hover:text-yellow-500"
              >
                📝 {t("workEntry")}
              </button>
              <a href="#operator" className="hover:text-yellow-500">
                👷 {t("operator")}
              </a>
              <button
                onClick={scrollToMaintenance}
                className="hover:text-yellow-500"
              >
                🛠 {t("maintenance")}
              </button>
            </div>

          
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          
          <div className="flex items-center gap-3">
            <img
              src={user.profilePic || defaultProfile}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 p-1 rounded"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleLanguage}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              {i18n.language === "en" ? "हिन्दी" : "English"}
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline flex items-center gap-1"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav> */}

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-b px-4 py-2 space-y-2">
            <a href="#home" onClick={toggleMenu}>
              🏠 {t("home")}
            </a>
            <a href="#dashboard" onClick={toggleMenu}>
              📊 {t("dashboard")}
            </a>
            <button onClick={scrollToWorkEntry}>📝 {t("workEntry")}</button>
            <a href="#operator" onClick={toggleMenu}>
              👷 {t("operator")}
            </a>
            <button onClick={scrollToMaintenance}>🛠 {t("maintenance")}</button>
          </div>
        )}

        {/* Hero Section */}
        <div
          id="home"
          className="flex-1 flex items-center justify-center text-center p-6"
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-yellow-500">
              {t("welcome", { name: user.name })}
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300">
              {t("description")}
            </p>
          </motion.div>
        </div>

        {/* Work Entry Section */}
        {/* <section ref={workEntryRef}>
          <WorkEntryRecordPage />
        </section> */}

        {/* Operator Section */}
        {/* <section id="operator">
          <OperatorPage />
        </section> */}

        {/* ✅ Maintenance Section */}
        {/* <section ref={maintenanceRef}>
          <MaintenancePage />
        </section> */}
      </div>
    </div>

  );
}
