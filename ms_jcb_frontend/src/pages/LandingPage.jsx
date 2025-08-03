import React, { useState, useEffect } from "react";
import api from "../services/api"; // ✅ Reuse same API instance

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sun, Moon, Home, ClipboardList, Wrench, Users } from "lucide-react";
import { LuChevronDown } from "react-icons/lu";
import defaultProfile from "../assets/defaultProfile.jpg";
import { useUser } from "../context/UserContext";
// Components
import WorkEntryForm from "../components/WorkEntryForm";
import WorkRecordsTable from "../components/WorkRecordsTable";
import OperatorForm from "../components/OperatorForm";
import OperatorPage from "../components/OperatorPage";
import SalaryTracker from "../components/SalaryTracker";
import MaintenanceForm from "../components/MaintenanceForm";
import MaintenanceList from "../components/MaintenanceList";
import AddMachine from "../components/AddMachine";
import ViewMachine from "../components/ViewMachine";
import UserRegistrationForm from "../components/UserRegistrationForm";
import ActivityLogTable from "../components/ActivityLogTable";

// Sidebar dropdown
const DropdownNav = ({
  id,
  title,
  icon,
  items,
  openDropdown,
  setOpenDropdown,
}) => {
  const open = openDropdown === id;
  const toggle = () => setOpenDropdown(open ? null : id);

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-800"
      >
        <span className="flex items-center gap-2">
          {icon} {title}
        </span>
        <span
          className={`transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <LuChevronDown />
        </span>
      </button>

      {open && (
        <div className="ml-6 mt-1 space-y-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-700"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const LandingPage = ({ user, navtoggle, setNavToggle }) => {
  const contextuser = useUser();

  // console.log(contextuser.user.groups[0]);
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openDropdown, setOpenDropdown] = useState(null);

  const [authorityLevel, setAuthorityLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  // const usergroups = contextuser.user.groups[0];

  // if (groups.includes("Level_1_Owner_admin")) {
  //   setAuthorityLevel(1);
  // } else if (groups.includes("Level_2_Staff_")) {
  //   setAuthorityLevel(2);
  // } else if (groups.includes("Level_3_Employee_operator")) {
  //   setAuthorityLevel(3);
  // } else {
  //   setAuthorityLevel(0); // Unknown
  // }
  useEffect(() => {
    api
      .get("user/")
      .then((response) => {
        const groups = response.data.groups || [];

        if (groups.includes("Level_1_Owner_admin")) {
          setAuthorityLevel(1);
        } else if (groups.includes("Level_2_Staff_")) {
          setAuthorityLevel(2);
        } else if (groups.includes("Level_3_Employee_operator")) {
          setAuthorityLevel(3);
        } else {
          setAuthorityLevel(0); // Unknown
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching user info in LandingPage:", error);
        setAuthorityLevel(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  // Show name in order: first_name + last_name → username → "User"
  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username || "User";

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all">
        {/* Sidebar */}
        <aside
          className={`${
            navtoggle ? "flex " : "hidden "
          } w-64 bg-white dark:bg-gray-800 border-r absolute sm:static h-full sm:flex flex-col`}
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-extrabold text-purple-600 tracking-wide hidden sm:block">
              MS JCB Works
            </h1>
          </div>

          <div className="flex flex-col flex-grow p-4 space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => setActiveSection("home")}
              className="flex items-center gap-2 p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-800"
            >
              <Home size={20} /> Dashboard
            </button>

            {/* ✅ User Dropdown - Only for Level 1 Admin */}
            {authorityLevel === 1 && (
              <DropdownNav
                id="user"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                title="User"
                icon={<Users size={20} />}
                items={[
                  {
                    name: "User Registration",
                    action: () => {
                      setActiveSection("user-registration");
                      setNavToggle(false);
                    },
                  },
                  {
                    name: "User Activity",
                    action: () => {
                      setActiveSection("user-activity");
                      setNavToggle(false);
                    },
                  },
                ]}
              />
            )}

            {/* Machines Dropdown - Only for authority level 1 or 2 */}
            {authorityLevel !== 3 && (
              <DropdownNav
                id="machines"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                title="Machines"
                icon={<Wrench size={20} />}
                items={[
                  {
                    name: "Add Machine",
                    action: () => {
                      setActiveSection("add-machine");
                      setNavToggle(false);
                    },
                  },
                  {
                    name: "View Machines",
                    action: () => {
                      setActiveSection("view-machine");
                      setNavToggle(false);
                    },
                  },
                ]}
              />
            )}

            {/* Work Dropdown */}
            <DropdownNav
              id="work"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              title="Work Entry"
              icon={<ClipboardList size={20} />}
              items={[
                {
                  name: "Work Entry Form",
                  action: () => {
                    setActiveSection("work-entry");
                    setNavToggle(false);
                  },
                },
                {
                  name: "Work Records",
                  action: () => {
                    setActiveSection("work-records");
                    setNavToggle(false);
                  },
                },
              ]}
            />

            {/* Maintenance Dropdown */}
            <DropdownNav
              id="maintenance"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              title="Maintenance"
              icon={<Wrench size={20} />}
              items={[
                {
                  name: "Maintenance Form",
                  action: () => {
                    setActiveSection("maintenance-form");
                    setNavToggle(false);
                  },
                },
                {
                  name: "Maintenance Record",
                  action: () => {
                    setActiveSection("maintenance-list");
                    setNavToggle(false);
                  },
                },
              ]}
            />

            {/* Operator Dropdown */}
            <DropdownNav
              id="operators"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              title="Operators"
              icon={<Users size={20} />}
              items={[
                ...(authorityLevel !== 3
                  ? [
                      {
                        name: "Operator Registration",
                        action: () => {
                          setActiveSection("operator-form");
                          setNavToggle(false);
                        },
                      },
                      {
                        name: "View Operators",
                        action: () => {
                          setActiveSection("operator-page");
                          setNavToggle(false);
                        },
                      },
                    ]
                  : []),
                {
                  name: "Salary Tracker",
                  action: () => {
                    setActiveSection("salary-tracker");
                    setNavToggle(false);
                  },
                },
              ]}
            />
          </div>

          {/* Profile & Actions */}
          <div className="mt-auto px-4 py-3 flex flex-col items-center border-t dark:border-gray-700">
            <img
              src={user?.profilePic || defaultProfile}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover mb-1 border-2 border-purple-500"
            />
            <p className="text-sm font-medium text-center mb-3">
              {displayName}
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleTheme}
                className="bg-gray-200 dark:bg-gray-700 p-1.5 rounded text-sm"
              >
                {darkMode ? <Sun size={11} /> : <Moon size={11} />}
              </button>

              <button
                onClick={toggleLanguage}
                className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs"
              >
                {i18n.language === "en" ? "हिन्दी" : "English"}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 py-0.5 rounded text-xs hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto sm:p-6 p-4 py-12 space-y-16 scroll-smooth">
          {activeSection === "home" && (
            <section
              id="home"
              className="h-screen flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <h1 className="text-4xl font-bold text-purple-600 mb-4">
                  Welcome to MS JCB Works
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                  MS JCB Works is committed to excellence in heavy machinery
                  operations and maintenance. Our operators, engineers, and
                  technicians work in sync to ensure safety, reliability, and
                  maximum efficiency across all projects. Track entries, monitor
                  maintenance, and manage operator performance with our
                  streamlined digital interface.
                </p>
              </motion.div>
            </section>
          )}
          {activeSection === "add-machine" && <AddMachine />}
          {activeSection === "view-machine" && <ViewMachine />}
          {activeSection === "work-entry" && <WorkEntryForm />}
          {activeSection === "work-records" && <WorkRecordsTable />}
          {activeSection === "maintenance-form" && <MaintenanceForm />}
          {activeSection === "maintenance-list" && <MaintenanceList />}
          {activeSection === "operator-form" && <OperatorForm />}
          {activeSection === "operator-page" && <OperatorPage />}
          {activeSection === "salary-tracker" && <SalaryTracker />}
          {activeSection === "user-registration" && <UserRegistrationForm />}
          {activeSection === "user-activity" && <ActivityLogTable />}
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
