import React from "react";
import { motion } from "framer-motion";

const CircleProgress = ({ percentage, label, size = 120 }) => {
  const radius = size / 2.5;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-lg font-semibold text-gray-800 dark:text-white">{percentage}%</p>
    </div>
  );
};


export default CircleProgress;
