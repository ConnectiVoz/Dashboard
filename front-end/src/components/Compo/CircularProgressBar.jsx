import React from "react";

const CircularProgressBar = ({ percentage }) => {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Validate percentage to prevent NaN
  const validPercentage =
    typeof percentage === "number" && !isNaN(percentage)
      ? percentage
      : 0;

  const strokeDashoffset =
    circumference - (circumference * validPercentage) / 100;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3B82F6"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="12"
        fill="#111827"
      >
        {validPercentage}%
      </text>
    </svg>
  );
};

export default CircularProgressBar;
