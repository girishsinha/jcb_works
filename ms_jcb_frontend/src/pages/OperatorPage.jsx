import React, { useEffect, useState, useRef } from 'react';
import OperatorForm from '../components/OperatorForm';
import OperatorCard from '../components/OperatorCard';
import SalaryTracker from '../components/SalaryTracker';
import { getOperators } from '../services/api';
import { useUser } from '../context/UserContext';

export default function OperatorPage() {
  const [operators, setOperators] = useState([]);
  const { user } = useUser();

  const formRef = useRef(null);
  const salaryRef = useRef(null);
  const [activeTab, setActiveTab] = useState('salary');

  const loadOperators = () => {
    getOperators()
      .then(res => setOperators(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const scrollTo = (ref, tab) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(tab);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-gray-800">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-300 mb-6">
        {(user.level <= 2) && (
          <button
            onClick={() => scrollTo(formRef, 'register')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'register' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register / View Operators
          </button>
        )}
        <button
          onClick={() => scrollTo(salaryRef, 'salary')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'salary' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Salary Tracker
        </button>
      </div>

      {/* Register / View Operators Section */}
      {(user.level <= 2) && (
        <section ref={formRef} className="mb-16">
          <OperatorForm onSuccess={loadOperators} />
          <h2 className="text-3xl font-bold mt-12 mb-6">Registered Operators</h2>
          {operators.length === 0 ? (
            <p className="text-gray-500">No operators registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {operators.map(op => (
                <OperatorCard key={op.id} operator={op} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Salary Tracker Section */}
      <section ref={salaryRef} className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Salary Tracker</h2>
        <SalaryTracker />
      </section>
    </div>
  );
}
