import React, { useEffect, useState } from "react";
import { getMachines, updateMachine, deleteMachine } from "../services/api";
import AddMachineForm from "./AddMachine";
import { FiMoreVertical } from "react-icons/fi";

const ViewMachines = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error("Error fetching machines:", err);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const form = new FormData();
      for (const key in updatedData) {
        form.append(key, updatedData[key]);
      }
      await updateMachine(selectedMachine.id, form);
      alert("✅ Machine updated successfully");
      setShowModal(false);
      setEditMode(false);
      fetchMachines();
    } catch (err) {
      console.error("Error updating machine:", err);
      alert("Update failed.");
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim())
      return alert("Please enter a reason for deletion.");
    try {
      await deleteMachine(selectedMachine.id, deleteReason);
      alert("✅ Machine deleted successfully");
      setShowModal(false);
      setShowDeletePopup(false);
      setSelectedMachine(null);
      fetchMachines();
    } catch (err) {
      console.error("Failed to delete machine:", err);
      alert("Deletion failed.");
    }
  };

  const openModal = (machine) => {
    setSelectedMachine(machine);
    setEditMode(false);
    setShowModal(true);
    setDeleteReason("");
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = machines.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(machines.length / recordsPerPage);

  return (
    <div className="sm:p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="sm:max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md sm:p-4 p-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Registered Machines
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Machine Number</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 w-10 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    No machines found
                  </td>
                </tr>
              ) : (
                currentRecords.map((machine) => (
                  <tr
                    key={machine.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{machine.machine_number}</td>
                    <td className="px-4 py-2">{machine.model_name}</td>
                    <td className="px-4 py-2">{machine.owner_name}</td>
                    <td className="px-4 py-2">{machine.status}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => openModal(machine)}>
                        <FiMoreVertical className="text-gray-700 dark:text-gray-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 overflow-y-auto">
          <div className="flex justify-center items-start min-h-screen pt-10 px-2">
            <div className="bg-white dark:bg-gray-900 max-w-5xl w-full rounded shadow-lg p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                  Machine Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  ✖
                </button>
              </div>

              <AddMachineForm
                machineData={selectedMachine}
                onSubmit={handleUpdate}
                disabled={!editMode ? true : false}
              />

              <div className="mt-6 flex justify-between gap-4">
                <button
                  onClick={() => {
                    if (editMode) {
                      handleUpdate(selectedMachine);
                    } else {
                      setEditMode(true);
                    }
                  }}
                  className={`${
                    editMode ? "bg-green-600" : "bg-yellow-500"
                  } text-white px-6 py-2 rounded-md`}
                >
                  {editMode ? "Submit" : "Update"}
                </button>

                <button
                  onClick={() => setShowDeletePopup(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reason Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Reason for Deletion
            </h3>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4"
              rows={3}
              placeholder="Enter reason here..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMachines;
