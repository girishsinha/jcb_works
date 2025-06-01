import React, { useEffect, useState } from 'react';
import { getMachines } from '../services/api';
import { Loader2, Tractor } from 'lucide-react';

const MachineList = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMachines()
      .then(response => {
        setMachines(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching machines:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Registered JCB Machines</h2>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2 text-blue-600">Loading machines...</span>
        </div>
      ) : machines.length === 0 ? (
        <p className="text-center text-gray-500">No machines found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-3">
                <Tractor className="text-yellow-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">{machine.machine_number}</h3>
              </div>
              <p className="text-sm text-gray-500">
                {machine.description || 'No description available.'}
              </p>
              <div className="mt-3 text-sm text-gray-600">
                Registered on: <span className="font-medium">{machine.registration_date || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MachineList;
