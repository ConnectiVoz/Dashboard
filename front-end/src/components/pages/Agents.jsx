import React, { useEffect, useState } from "react";

const API_BASE = "https://rivoz.in/api/bots";

function Agents() {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    bot_name: "",
    kb_id: "",
    introduction: "",
    system_instruction: "",
    agent_instruction: "",
    supported_language: {},
    is_active: true,
    from_phnumber: "",
    to_phnumber: "",
    name: "",
    email: "",
    status: "Connected",
    call_date: new Date().toISOString().split("T")[0],
    call_time: new Date().toISOString(),
    campaign: 0,
    agent: "",
    duration: 0,
    call_recording: ""
  });

  const isAdmin = sessionStorage.getItem("role") === "admin";

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/list`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const toggleStatus = async (bot_id, isActive) => {
    try {
      const token = sessionStorage.getItem("token");
      await fetch(`https://rivoz.in/api/bots/update-status/${bot_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !isActive }),
      });
      fetchAgents();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAgent = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      console.log("Agent created:", result);

      if (res.ok) {
        alert("Agent Created Successfully");
        fetchAgents();
      } else {
        alert(result?.detail || "Failed to create agent");
      }
    } catch (err) {
      console.error("Error creating agent:", err);
      alert("Error creating agent");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700">
      { <h2 className="text-2xl font-semibold mb-4">Agents</h2>
     /* <div className="mb-6 space-y-2">
        <input name="bot_name" placeholder="Bot Name" value={formData.bot_name} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="kb_id" placeholder="Knowledge Base ID" value={formData.kb_id} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="introduction" placeholder="Introduction" value={formData.introduction} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="system_instruction" placeholder="System Instruction" value={formData.system_instruction} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="agent_instruction" placeholder="Agent Instruction" value={formData.agent_instruction} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="from_phnumber" placeholder="From Phone Number" value={formData.from_phnumber} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="to_phnumber" placeholder="To Phone Number" value={formData.to_phnumber} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="agent" placeholder="Agent" value={formData.agent} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <input name="call_recording" placeholder="Call Recording URL" value={formData.call_recording} onChange={handleInputChange} className="p-2 rounded text-black w-full" />
        <button
          onClick={() => {
            if (!isAdmin) {
              alert("Only admin users are allowed to create agents.");
              return;
            }
            handleCreateAgent();
          }}
          className={`px-4 py-2 rounded font-semibold ${
            isAdmin ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Create Agent
        </button>
      </div> */}

      {/* AGENTS TABLE */}
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2 text-gray-400 text-left">Name</th>
            <th className="p-2 text-gray-400 text-left">Active</th>
            <th className="p-2 text-gray-400 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.bot_id} className="border-b border-gray-700 hover:bg-gray-750">
              <td className="p-2">{agent.bot_name}</td>
              <td className="p-2">{agent.is_active ? "Yes" : "No"}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleStatus(agent.bot_id, agent.is_active)}
                  className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold"
                >
                  {agent.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Agents;
