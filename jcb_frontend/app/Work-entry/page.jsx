"use client";
import React, { useRef } from "react";
import WorkEntryForm from "../components/WorkEntryForm";
import WorkRecordsTable from "../components/WorkRecordsTable";

const Work_Entry_Record_Page = () => {
  const entryRef = useRef(null);
  const recordRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white min-h-screen pb-12">
      {/* Local Navbar for scrolling */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 shadow z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex space-x-6 justify-center">
          <button
            onClick={() => scrollToSection(entryRef)}
            className="text-blue-600 font-semibold hover:underline"
          >
            Work Entry
          </button>
          <button
            onClick={() => scrollToSection(recordRef)}
            className="text-blue-600 font-semibold hover:underline"
          >
            Work Records
          </button>
        </div>
      </div>

      {/* Work Entry Section */}
      <div ref={entryRef} className="pt-8">
        <WorkEntryForm />
      </div>

      {/* Work Records Section */}
      <div ref={recordRef} className="pt-8">
        <WorkRecordsTable />
      </div>
    </div>
  );
};

export default Work_Entry_Record_Page;
