import React, { useEffect, useState, useRef } from "react";
import OperatorForm from "../components/OperatorForm";
import OperatorCard from "../components/OperatorCard";
import SalaryTracker from "../components/SalaryTracker";
import { getOperators } from "../services/api";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

export default function OperatorPage() {
  const [operators, setOperators] = useState([]);
  const { user } = useUser();

  const formRef = useRef(null);
  const salaryRef = useRef(null);

  const loadOperators = () => {
    getOperators()
      .then((res) => setOperators(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const scrollTo = (ref, tab) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tab);
  };
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Registered-Operators");

  return (
    <div className={`${theme.darkMode ? "dark bg-gray-900" : ""} p-6`}>
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-300 mb-6">
        {user.level <= 2 && (
          <button
            onClick={() => {
              setActiveTab("Registered-Operators");
            }}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "Registered-Operators"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Register / View Operators
          </button>
        )}
        <button
          onClick={() => setActiveTab("Salary-tracker")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "Salary-tracker"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Salary Tracker
        </button>
      </div>

      {/* Register / View Operators Section */}
      {user.level <= 2 && (
        <section className="mb-16">
          {activeTab == "Registered-Operators" && (
            <OperatorForm onSuccess={loadOperators} />
          )}
          {/* Salary Tracker Section */}
          {activeTab == "Salary-tracker" && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Salary Tracker</h2>
              <SalaryTracker />
            </section>
          )}
          <h2 className="text-3xl font-bold mt-12 mb-6">
            Registered Operators
          </h2>
          {operators.length === 0 ? (
            <p className="text-gray-500">No operators registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {operators.map((op) => (
                <OperatorCard key={op.id} operator={op} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
