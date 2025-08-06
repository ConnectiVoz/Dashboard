import React from "react";

function Chats() {
  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 transform hover:translate-y-[-5px] hover:bg-gray-750 transition ease-in-out duration-500">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>

      {/* List or table for chats */}
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2 text-gray-400 text-left">Username</th>
            <th className="p-2 text-gray-400 text-left">Last Message</th>
            <th className="p-2 text-gray-400 text-left">Time</th>
            <th className="p-2 text-gray-400 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Mock data or mapped chats*/}
          <tr className="border-b border-gray-700 hover:bg-gray-750">
            <td className="p-2">Alice</td>
            <td className="p-2">Hey, there! How can I help you today?</td>
            <td className="p-2">2025-06-08 16:45</td>
            <td className="p-2">
              <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Chats;

