// Reports.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Calling from "./Calling";
import Billing from "./Billing";

function Reports() {
  return (
    <div className="bg-gradient-to-br from-[#e0e7ff]/60 via-[#f8fafc]/80 to-[#fbc2eb]/60 min-h-screen py-8">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-xl rounded-2xl mx-2 mb-6 animate-fade-in-down">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-tr from-[#6366f1] to-[#a18cd1] text-white px-3 py-1.5 rounded-full font-bold shadow text-base tracking-wide drop-shadow">
            iVoz
          </span>
          <span className="text-gray-700 font-semibold text-base">Vanshika</span>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-2 md:px-6">
        {/* Sidebar */}
        <aside className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-4 md:p-6 w-full md:w-64 mb-6 md:mb-0 md:mr-6 animate-fade-in-up">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 drop-shadow">Reports</h2>
          <ul className="space-y-3">
            <li>
              <span className="block px-4 py-2 rounded-xl font-semibold text-gray-400 bg-gray-100 cursor-not-allowed pointer-events-none opacity-60">
                Calling (Disabled)
              </span>
            </li>
            <li>
              <span className="block px-4 py-2 rounded-xl font-semibold text-gray-400 bg-gray-100 cursor-not-allowed pointer-events-none opacity-60">
                Billing (Disabled)
              </span>
            </li>
          </ul>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 animate-fade-in-up">
          <div className="text-center text-gray-500 text-base md:text-lg">
            <p className="mb-4">🔒 Reports section is currently disabled.</p>
            <p>Please check back later once this module is available.</p>
          </div>
          <Routes>
            {/* <Route path="/" element={<Calling />} /> */}
            <Route path="calling" element={<Calling />} />
            <Route path="billing" element={<Billing />} />
          </Routes>
        </main>
      </div>

      {/* Footer Note */}
      <div className="p-4 mt-6 text-center text-gray-500 text-sm">
        <span className="bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 px-4 py-2 rounded-full shadow-md">
          Note: Zoho integration is active. Other services are currently unavailable.
        </span>
      </div>
    </div>
  );
}

export default Reports;
