// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { motion } from "framer-motion";
// import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
// import defaultProfile from "../assets/defaultProfile.jpg";
// import OperatorPage from './OperatorPage'; // ✅ Imported OperatorPage

// const LandingPage = ({ user = { name: "Vikash Yadu", profilePic: null } }) => {
//   const { t, i18n } = useTranslation();
//   const [darkMode, setDarkMode] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleLanguage = () =>
//     i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className={`${darkMode ? "dark" : ""}`}>
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 overflow-y-auto scroll-smooth">
        
//         {/* Navbar */}
//         <nav className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-gray-800">
//           {/* Left: Navigation Links */}
//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex gap-4">
//               <Link to="/home" className="hover:text-yellow-500">🏠 {t("home")}</Link>
//               <Link to="/dashboard" className="hover:text-yellow-500">📊 {t("dashboard")}</Link>
//               <Link to="/work-entry" className="hover:text-yellow-500">📝 {t("workEntry")}</Link>
//               <Link to="/operator" className="hover:text-yellow-500">👷 {t("operator")}</Link>
//             </div>

//             {/* Mobile Menu Toggle */}
//             <div className="md:hidden">
//               <button onClick={toggleMenu}>
//                 {menuOpen ? <X /> : <Menu />}
//               </button>
//             </div>
//           </div>

//           {/* Right: Profile, Theme, Language, Logout */}
//           <div className="flex items-center gap-3">
//             <img
//               src={user.profilePic || defaultProfile}
//               alt="Profile"
//               className="w-9 h-9 rounded-full object-cover"
//             />

//             <button
//               onClick={toggleTheme}
//               className="bg-gray-200 dark:bg-gray-700 p-1 rounded"
//             >
//               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>

//             <button
//               onClick={toggleLanguage}
//               className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
//             >
//               {i18n.language === "en" ? "हिन्दी" : "English"}
//             </button>

//             <button
//               onClick={handleLogout}
//               className="text-red-500 hover:underline flex items-center gap-1"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </nav>

//         {/* Mobile dropdown menu */}
//         {menuOpen && (
//           <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-b px-4 py-2 space-y-2">
//             <Link to="/home" onClick={toggleMenu}>🏠 {t("home")}</Link>
//             <Link to="/dashboard" onClick={toggleMenu}>📊 {t("dashboard")}</Link>
//             <Link to="/work-entry" onClick={toggleMenu}>📝 {t("workEntry")}</Link>
//             <Link to="/operator" onClick={toggleMenu}>👷 {t("operator")}</Link>
//           </div>
//         )}

//         {/* Main Hero Content */}
//         <div className="flex-1 flex items-center justify-center text-center p-6">
//           <motion.div
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
//           >
//             <h1 className="text-3xl md:text-5xl font-bold mb-4 text-yellow-500">
//               {t("welcome", { name: user.name })}
//             </h1>
//             <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300">
//               {t("description")}
//             </p>
//           </motion.div>
//         </div>

//         {/* ✅ Operator Section from previous layout */}
//         <section id="operator">
//           <OperatorPage />
//         </section>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;



// import React, { useState, useRef } from "react"; // ✅ import useRef
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { motion } from "framer-motion";
// import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
// import defaultProfile from "../assets/defaultProfile.jpg";
// import OperatorPage from './OperatorPage';
// import WorkEntryRecordPage from './Work_Entry_Record_Page'; // ✅ Import your component
// import MaintenancePage from './MaintenancePage';


// const LandingPage = ({ user = { name: "Vikash Yadu", profilePic: null } }) => {
//   const { t, i18n } = useTranslation();
//   const [darkMode, setDarkMode] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const workEntryRef = useRef(null); // ✅ Create a ref for the WorkEntry section
//   const maintenanceRef = useRef(null);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleLanguage = () =>
//     i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const scrollToWorkEntry = () => {
//     if (workEntryRef.current) {
//       workEntryRef.current.scrollIntoView({ behavior: "smooth" });
//       setMenuOpen(false); // Close menu on mobile
//     }
//   };

//   return (
//     <div className={`${darkMode ? "dark" : ""}`}>
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 overflow-y-auto scroll-smooth">
        
//         {/* Navbar */}
//         <nav className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-gray-800">
//           {/* Left: Navigation Links */}
//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex gap-4">
//               <a href="#home" className="hover:text-yellow-500">🏠 {t("home")}</a>
//               <a href="#dashboard" className="hover:text-yellow-500">📊 {t("dashboard")}</a>
//               <button onClick={scrollToWorkEntry} className="hover:text-yellow-500">📝 {t("workEntry")}</button>
//               <a href="#operator" className="hover:text-yellow-500">👷 {t("operator")}</a>
//             </div>

//             {/* Mobile Menu Toggle */}
//             <div className="md:hidden">
//               <button onClick={toggleMenu}>
//                 {menuOpen ? <X /> : <Menu />}
//               </button>
//             </div>
//           </div>

//           {/* Right: Profile, Theme, Language, Logout */}
//           <div className="flex items-center gap-3">
//             <img
//               src={user.profilePic || defaultProfile}
//               alt="Profile"
//               className="w-9 h-9 rounded-full object-cover"
//             />

//             <button
//               onClick={toggleTheme}
//               className="bg-gray-200 dark:bg-gray-700 p-1 rounded"
//             >
//               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>

//             <button
//               onClick={toggleLanguage}
//               className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
//             >
//               {i18n.language === "en" ? "हिन्दी" : "English"}
//             </button>

//             <button
//               onClick={handleLogout}
//               className="text-red-500 hover:underline flex items-center gap-1"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </nav>

//         {/* Mobile dropdown menu */}
//         {menuOpen && (
//           <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-b px-4 py-2 space-y-2">
//             <a href="#home" onClick={toggleMenu}>🏠 {t("home")}</a>
//             <a href="#dashboard" onClick={toggleMenu}>📊 {t("dashboard")}</a>
//             <button onClick={scrollToWorkEntry}>📝 {t("workEntry")}</button>
//             <a href="#operator" onClick={toggleMenu}>👷 {t("operator")}</a>
//           </div>
//         )}

//         {/* Hero Section */}
//         <div id="home" className="flex-1 flex items-center justify-center text-center p-6">
//           <motion.div
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
//           >
//             <h1 className="text-3xl md:text-5xl font-bold mb-4 text-yellow-500">
//               {t("welcome", { name: user.name })}
//             </h1>
//             <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300">
//               {t("description")}
//             </p>
//           </motion.div>
//         </div>

//         {/* Work Entry Section */}
//         <section ref={workEntryRef}>
//           <WorkEntryRecordPage />
//         </section>

//         {/* Operator Section */}
//         <section id="operator">
//           <OperatorPage />
//         </section>

//          {/* ✅ Maintenance Section */}
//         <section ref={maintenanceRef}>
//           <MaintenancePage />
//         </section>

//       </div>
//     </div>
//   );
// };

// export default LandingPage;




import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
import defaultProfile from "../assets/defaultProfile.jpg";

import OperatorPage from './OperatorPage';
import WorkEntryRecordPage from './Work_Entry_Record_Page';
import MaintenancePage from './MaintenancePage'; // ✅ Import MaintenancePage

const LandingPage = ({ user = { name: "Vikash Yadu", profilePic: null } }) => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate("/login");
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

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 overflow-y-auto scroll-smooth">

        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 py-3 border-b bg-gray-100 dark:bg-gray-800">
          {/* Left: Navigation Links */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <a href="#home" className="hover:text-yellow-500">🏠 {t("home")}</a>
              <a href="#dashboard" className="hover:text-yellow-500">📊 {t("dashboard")}</a>
              <button onClick={scrollToWorkEntry} className="hover:text-yellow-500">📝 {t("workEntry")}</button>
              <a href="#operator" className="hover:text-yellow-500">👷 {t("operator")}</a>
              <button onClick={scrollToMaintenance} className="hover:text-yellow-500">🛠 {t("maintenance")}</button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Right: Theme, Language, Profile, Logout */}
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
        </nav>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-b px-4 py-2 space-y-2">
            <a href="#home" onClick={toggleMenu}>🏠 {t("home")}</a>
            <a href="#dashboard" onClick={toggleMenu}>📊 {t("dashboard")}</a>
            <button onClick={scrollToWorkEntry}>📝 {t("workEntry")}</button>
            <a href="#operator" onClick={toggleMenu}>👷 {t("operator")}</a>
            <button onClick={scrollToMaintenance}>🛠 {t("maintenance")}</button>
          </div>
        )}

        {/* Hero Section */}
        <div id="home" className="flex-1 flex items-center justify-center text-center p-6">
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
        <section ref={workEntryRef}>
          <WorkEntryRecordPage />
        </section>

        {/* Operator Section */}
        <section id="operator">
          <OperatorPage />
        </section>

        {/* ✅ Maintenance Section */}
        <section ref={maintenanceRef}>
          <MaintenancePage />
        </section>
        
      </div>
    </div>
  );
};

export default LandingPage;
