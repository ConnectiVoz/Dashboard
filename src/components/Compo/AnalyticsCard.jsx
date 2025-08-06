import React from "react";

const analyticsData = [
  { label: "Reach", percent: 78 },
  { label: "Impressions", percent: 60 },
  { label: "Clicks", percent: 42 },
  { label: "Conversions", percent: 25 },
];

const AnalyticsProgress = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 transition duration-300 hover:scale-[1.02]">
      <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
        📊 Analytics Breakdown
      </h2>
      <div className="space-y-5">
        {analyticsData.map((item, idx) => (
          <div key={idx} className="w-full">
            <div className="flex justify-between text-white text-sm mb-1">
              <span>{item.label}</span>
              <span>{item.percent}%</span>
            </div>
            <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 overflow-hidden">
              <div
                className="absolute h-full left-0 bg-gradient-to-r from-white via-gray-200 to-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsProgress;
