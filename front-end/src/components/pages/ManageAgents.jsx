import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const ManageAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const token = sessionStorage.getItem("token");
      const res = await fetch("https://rivoz.in/api/bots/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      setAgents(result.bots || []);
    };

    fetchAgents();
  }, []);

  return (
    <div className="p-4 text-white bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Agents</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => {
          const completed = agent.completed || Math.floor(Math.random() * 10) + 1;
          const total = agent.total || 10;
          const percentage = ((completed / total) * 100).toFixed(0);

          return (
            <div key={agent.id || i} className="p-4 bg-white/10 rounded-xl shadow">
              <h3 className="font-bold text-white mb-1">{agent.bot_name || "Agent"}</h3>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }} />
              </div>
              <p className="text-xs text-gray-300">{completed} / {total} calls</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageAgents;
