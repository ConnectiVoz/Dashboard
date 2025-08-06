// src/components/Progress.jsx
import React from "react";

const Progress = ({ label, percentage }) => {
  return (
    <div className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-black transition">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-800 group-hover:text-black">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;
