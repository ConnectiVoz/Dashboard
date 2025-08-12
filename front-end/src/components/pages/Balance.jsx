// src/pages/Balance.jsx
import React, { useState } from "react";
import { FaWallet, FaMoneyBillWave, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { DateRangePicker } from "react-date-range";
import { format, isWithinInterval } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import './index.css' // custom dark mode styles

const Balance = () => {
  const [search, setSearch] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAmountDatePicker, setShowAmountDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const [amountDateRange, setAmountDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  // Transactions will come from API
  const transactions = [];

  // Filtered transactions for main list
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = isWithinInterval(new Date(t.date), {
      start: dateRange[0].startDate,
      end: dateRange[0].endDate,
    });
    return matchesSearch && matchesDate;
  });

  // Amount spent based on separate calendar filter
  const filteredForAmount = transactions.filter((t) =>
    isWithinInterval(new Date(t.date), {
      start: amountDateRange[0].startDate,
      end: amountDateRange[0].endDate,
    })
  );

  const amountSpent = filteredForAmount.reduce((acc, t) => acc + (t.spent || 0), 0);

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Balance Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 md:p-6 rounded-2xl shadow-lg flex items-center gap-4">
          <FaWallet size={30} className="md:size-10" />
          <div>
            <p className="text-base md:text-lg">Account Balance</p>
            <h2 className="text-xl md:text-2xl font-bold">₹ 0</h2>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 md:p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave size={30} className="md:size-10" />
            <div>
              <p className="text-base md:text-lg">Amount Spent</p>
              <h2 className="text-xl md:text-2xl font-bold">₹ {amountSpent}</h2>
            </div>
          </div>
          <button
            onClick={() => setShowAmountDatePicker(!showAmountDatePicker)}
            className="bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 px-3 py-2 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaCalendarAlt />
          </button>
        </div>
      </div>

      {/* Amount Spent Calendar */}
      {showAmountDatePicker && (
        <div className="inline-block mb-8 border rounded-xl overflow-hidden shadow-lg calendar-dark">
          <DateRangePicker
            ranges={amountDateRange}
            onChange={(item) => setAmountDateRange([item.selection])}
          />
          <p className="mt-2 text-sm px-2 pb-2">
            Selected: {format(amountDateRange[0].startDate, "dd MMM yyyy")} -{" "}
            {format(amountDateRange[0].endDate, "dd MMM yyyy")}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Spending Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredTransactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                color: "#fff",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="spent" fill="#8884d8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search & Date Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-full md:w-1/3">
          <FaSearch className="text-gray-500 dark:text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent outline-none w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FaFilter /> Filter by Date
        </button>
      </div>

      {showDatePicker && (
        <div className="inline-block mb-4 border rounded-xl overflow-hidden shadow-lg calendar-dark">
          <DateRangePicker
            ranges={dateRange}
            onChange={(item) => setDateRange([item.selection])}
          />
          <p className="mt-2 text-sm px-2 pb-2">
            Selected: {format(dateRange[0].startDate, "dd MMM yyyy")} -{" "}
            {format(dateRange[0].endDate, "dd MMM yyyy")}
          </p>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg md:text-xl font-bold mb-4">Transactions</h2>
        {filteredTransactions.length > 0 ? (
          <ul className="space-y-2">
            {filteredTransactions.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm"
              >
                <span className="text-gray-900 dark:text-gray-100">{t.name}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  ₹ {t.spent}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            No transactions found
          </p>
        )}
      </div>
    </div>
  );
};

export default Balance;
