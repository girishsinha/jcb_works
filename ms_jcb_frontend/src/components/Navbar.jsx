import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: clean icons
import { Sun, Moon, LogOut } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const navItems = [
    { name: "🏠 Home", href: "/" },
    { name: "📊 Dashboard", href: "/dashboard" },
    { name: "📝 Work Entry", href: "/work-entry" },
    { name: "👷 Operator", href: "/operators" },
    { name: "🛠 Maintenance", href: "/maintenance" },
  ];
  const darkMode = theme.darkMode;
  return (
    <div className={`${darkMode ? "dark" : ""}  `}>
      <nav className={`bg-white border-gray-200 dark:bg-gray-900`}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            🛠 JCB Panel
          </div>

          {/* Hamburger (mobile) */}
          <div className="md:hidden dark:text-white z-50">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
              {/* {isOpen ? "X" : "☰"} Simple text toggle for demo */}
            </button>
          </div>

          {/* Nav Links (desktop) */}
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent focus:text-blue-700"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => theme.setDarkMode(!theme.darkMode)}
                  className="text-black dark:text-white p-1 rounded"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </li>
              <li>
                <button
                  //   onClick={toggleLanguage}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  {/* {i18n.language === "en" ? "हिन्दी" : "English"} */} lg
                </button>
              </li>
              <li>
                {" "}
                <button
                  //   onClick={handleLogout}
                  className="text-red-500 hover:underline flex items-center gap-1"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </li>{" "}
            </ul>
          </div>
        </div>

        {/* Nav Links (mobile dropdown) */}
        {isOpen && (
          <motion.ul
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            className=" absolute top-0 right-0 h-full w-2/3 font-medium flex flex-col items-start justify-start gap-6 p-8 pt-12 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent focus:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-4 ">
              <button
                onClick={() => theme.setDarkMode(!theme.darkMode)}
                className="text-black dark:text-white p-1 rounded"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                //   onClick={toggleLanguage}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                {/* {i18n.language === "en" ? "हिन्दी" : "English"} */} lg
              </button>{" "}
              <button
                //   onClick={handleLogout}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            </li>{" "}
          </motion.ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
