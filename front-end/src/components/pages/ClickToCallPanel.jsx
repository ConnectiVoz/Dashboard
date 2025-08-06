import React, { useState } from "react";

const ClickToCallPanel = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedUser, setSelectedUser] = useState('Divya');

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 transform hover:translate-y-[-5px] hover:bg-gray-750 transition ease-in-out duration-500">
      <h3 className="text-2xl font-semibold text-center mb-6">Click To Call</h3>

      {/* Number Input */}
      <div className="mb-4">
        <label className="block text-gray-400 font-semibold mb-1">Number</label>
        <div className="flex">
          <span className="bg-gray-800 p-2 rounded-l-md border border-gray-700">+91</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="flex-1 p-2 rounded-r-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-50"
          />
        </div>
      </div>

      {/* User Select */}
      <div className="mb-4">
        <label className="block text-gray-400 font-semibold mb-1">Select User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-50">
          <option>Divya</option>
          <option>Agent 1</option>
          <option>Agent 2</option>
        </select>
      </div>

      {/* Call Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-green-500 hover:bg-green-600 p-4 rounded-full text-2xl font-semibold transform hover:rotate-12 transition ease-in-out duration-500">
          Call Now
        </button>
      </div>
    </div>
  )
}

export default ClickToCallPanel;

