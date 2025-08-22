
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";
import { toast } from "react-toastify";
import { FaSync, FaUser } from "react-icons/fa";

export default function AgentList({ onSelectAgent }) {
  const [agents, setAgents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgents = async () => {
    try {
      setRefreshing(true);
      const response = await fetchWithAuth("https://rivoz.in/api/bots/list");
      if (!response.ok) throw new Error("Failed to fetch agents");
      const data = await response.json();
      setAgents(data || []);

      // Auto-select ivozvoiceagent
      const ivozAgent = data.find((bot) => bot.bot_name === "ivozvoiceagent");
      if (ivozAgent && onSelectAgent) {
        onSelectAgent(ivozAgent);
      }
    } catch (err) {
      toast.error("Error fetching agents");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FaUser className="text-blue-500" />
          Bot List
        </h2>
        <button
          onClick={fetchAgents}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition 
            ${refreshing 
              ? "bg-blue-300 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md"}`}
        >
          {refreshing ? (
            <>
              <FaSync className="animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <FaSync />
              Refresh
            </>
          )}
        </button>
      </div>

      {agents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-center py-10">No bots found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left">Bot Name</th>
                <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((bot) => {
                const isIvoz = bot.bot_name === "ivozvoiceagent";
                return (
                  <tr
                    key={bot.bot_id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer 
                      ${isIvoz ? "bg-indigo-50 dark:bg-indigo-900 font-semibold" : "opacity-50 cursor-not-allowed"}`}
                    onClick={() => isIvoz && onSelectAgent && onSelectAgent(bot)}
                  >
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">{bot.bot_name}</td>
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                      {bot.is_active ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-500 dark:text-red-400 font-semibold">Inactive</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
