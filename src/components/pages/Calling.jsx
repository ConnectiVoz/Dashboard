import React from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Calling() {
  // Mock data for charts
  const callData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Calls',
        data: [12, 19, 13, 15, 18, 16, 14, 20, 18, 17, 16, 19],
        fill: true,
        tension: 0.4,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.15)',
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff]/60 via-[#f8fafc]/80 to-[#fbc2eb]/60 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl text-gray-900 p-8 rounded-3xl shadow-2xl border border-white/30 animate-fade-in-up transition-all duration-500">
        <h2 className="text-3xl font-extrabold mb-6 drop-shadow-lg text-gray-800 tracking-tight text-center bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Calling Report
        </h2>

        {/* Chart */}
        <div className="bg-gradient-to-tr from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/30 mb-8 animate-fade-in-down">
          <Line
            id="callingChart"
            data={callData}
            options={{
              color: "#6366f1",
              plugins: {
                legend: { labels: { color: "#6366f1", font: { size: 16, weight: "bold" } } }
              },
              scales: {
                x: { ticks: { color: "#6366f1", font: { weight: "bold" } }, grid: { color: "#e0e7ff" } },
                y: { ticks: { color: "#6366f1", font: { weight: "bold" } }, grid: { color: "#e0e7ff" } }
              }
            }}
          />
        </div>

        {/* Summary Boxes */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 p-6 rounded-2xl border border-white/30 bg-gradient-to-tr from-blue-400/10 via-white/30 to-purple-400/10 shadow-lg flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Calls</h3>
            <p className="text-3xl font-extrabold text-gray-800">86</p>
          </div>
          <div className="flex-1 p-6 rounded-2xl border border-white/30 bg-gradient-to-tr from-green-400/10 via-white/30 to-blue-400/10 shadow-lg flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Connected</h3>
            <p className="text-3xl font-extrabold text-gray-800">70</p>
          </div>
          <div className="flex-1 p-6 rounded-2xl border border-white/30 bg-gradient-to-tr from-pink-400/10 via-white/30 to-purple-400/10 shadow-lg flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">Missed</h3>
            <p className="text-3xl font-extrabold text-gray-800">16</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calling;