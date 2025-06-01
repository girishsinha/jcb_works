import React from 'react';

export default function OperatorCard({ operator }) {
  const files = [
    { label: 'Photo', path: operator.photo },
    { label: 'ID Proof', path: operator.id_proof },
    { label: 'License', path: operator.license },
  ];

  return (
    <div className="w-full max-w-xs mx-auto perspective my-4">
      <div
        className="relative w-full h-80 rounded-xl shadow-lg transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 bg-white rounded-xl border border-gray-300 p-6 backface-hidden flex flex-col justify-center space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{operator.name}</h3>
          <p><span className="font-semibold">Age:</span> {operator.age}</p>
          <p><span className="font-semibold">Salary:</span> ₹{operator.salary}</p>
          <p className="truncate" title={operator.address}><span className="font-semibold">Address:</span> {operator.address}</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-gray-50 rounded-xl border border-gray-300 p-6 rotate-y-180 backface-hidden flex flex-col">
          <h4 className="font-semibold text-lg mb-3 text-blue-600">Documents</h4>
          <ul className="flex flex-col gap-2">
            {files.map(
              (file) =>
                file.path && (
                  <li key={file.label}>
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {file.label}
                    </a>
                  </li>
                )
            )}
            {!files.some(f => f.path) && (
              <li className="text-gray-400 italic">No files uploaded</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
