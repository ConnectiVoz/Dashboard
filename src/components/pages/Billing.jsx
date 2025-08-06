import React from "react";

const invoices = [
  { id: "4888323B-0007", status: "Paid", amount: 20, created: "2025-04-04" },
  { id: "4888323B-0008", status: "Paid", amount: 15, created: "2025-04-04" },
  { id: "4888323B-0009", status: "Paid", amount: 90, created: "2025-04-04" },
  { id: "4888323B-0010", status: "Paid", amount: 5, created: "2025-04-04" },
  { id: "4888323B-0011", status: "Paid", amount: 11, created: "2025-04-04" },
];

function Billing() {
  return (
    <div className="bg-gradient-to-br from-[#e0e7ff]/60 via-[#f8fafc]/80 to-[#fbc2eb]/60 min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white/40 backdrop-blur-2xl text-gray-900 p-8 rounded-3xl shadow-2xl border border-white/30 transition-all duration-500 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold mb-6 drop-shadow-lg text-gray-800 tracking-tight text-center bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Billing
        </h2>

        {/* Credit balance */}
        <div className="bg-gradient-to-tr from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 mb-8 flex flex-col items-center animate-fade-in-down">
          <h2 className="text-xl font-semibold text-gray-700">Credit Balance</h2>
          <p className="text-5xl font-extrabold mt-4 text-transparent bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 bg-clip-text drop-shadow-lg animate-pulse">
            $1500
          </p>
        </div>

        {/* Billing history table */}
        <section className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/30 transition-all duration-500 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 drop-shadow">Billing History</h2>
          <p className="text-gray-600 mb-2">Showing invoices within the past 12 months</p>

          <div className="overflow-x-auto">
            <table className="min-w-full mt-4 rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-white/30 bg-gradient-to-r from-blue-50/60 via-white/60 to-pink-50/60">
                  <th className="text-gray-500 p-3 text-left font-semibold">Invoice</th>
                  <th className="text-gray-500 p-3 text-left font-semibold">Status</th>
                  <th className="text-gray-500 p-3 text-left font-semibold">Amount</th>
                  <th className="text-gray-500 p-3 text-left font-semibold">Created</th>
                  <th className="text-gray-500 p-3 text-left font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-white/20 transition-all duration-200 ${
                      idx % 2 === 0
                        ? "bg-white/30"
                        : "bg-gradient-to-r from-blue-100/20 via-white/20 to-pink-100/20"
                    } hover:bg-gradient-to-tr hover:from-blue-200/40 hover:to-pink-200/40 hover:shadow-lg`}
                  >
                    <td className="p-3 font-mono">{item.id}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-gradient-to-tr from-green-400 to-green-600 text-white">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-blue-700">${item.amount}</td>
                    <td className="p-3">{item.created}</td>
                    <td className="p-3">
                      <button className="bg-gradient-to-tr from-blue-400 to-blue-600 text-white px-4 py-1 rounded-lg font-semibold shadow hover:scale-105 hover:from-blue-500 hover:to-blue-800 transition-all duration-200">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Billing;