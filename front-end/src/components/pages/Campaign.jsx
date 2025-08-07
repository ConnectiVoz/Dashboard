import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";

export default function CampaignPage() {
  const [campaignName, setCampaignName] = useState("");
  const [selectedBotId, setSelectedBotId] = useState("");
  const [bots, setBots] = useState([]);
  const [creating, setCreating] = useState(false);
  const [file_name, setFileName] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [runningCampaigns, setRunningCampaigns] = useState(
    JSON.parse(localStorage.getItem("runningCampaigns") || "[]")
  );

  useEffect(() => {
    fetchBots();
    fetchCampaigns();
    fetchCallLists();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    localStorage.setItem("runningCampaigns", JSON.stringify(runningCampaigns));
  }, [runningCampaigns]);

  const handleBeforeUnload = (e) => {
    if (runningCampaigns.length > 0) {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your campaign will stop if you refresh.";
    }
  };

  const fetchBots = async () => {
    try {
      const res = await fetch("https://3.95.238.222/api/bots/list");
      const data = await res.json();
      const filtered = data.filter((bot) => bot.bot_name === "ivozvoiceagent");
      setBots(filtered);
      if (filtered.length > 0) setSelectedBotId(filtered[0].id);
    } catch (err) {
      console.error("Bots fetch error", err);
      toast.error("Failed to fetch bots.");
    }
  };

 const fetchCallLists = async () => {
  try {
    const res = await fetchWithAuth("https://3.95.238.222/api/call_list/files");

    // Try parsing only if status is OK
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

   if (Array.isArray(data.files)) {
  setFileName(data.files);
} else {
  console.error("Unexpected call list format", data);
  toast.error("Invalid call list format received.");
}

} catch (err) {
    console.error("Call lists fetch error", err);
    toast.error("Failed to fetch call lists.");
  }
};

  const fetchCampaigns = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("https://3.95.238.222/api/campaigns/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setCampaigns(list);
      setFilteredCampaigns(list);
    } catch (err) {
      console.error("Campaigns fetch error", err);
      toast.error("Failed to fetch campaigns.");
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    const payload = {
      bot_id: selectedBotId,
      name: campaignName,
      scheduled_datetime: new Date().toISOString(),
      call_list_file: selectedFileName,
    };
    try {
      const res = await fetch("https://3.95.238.222/api/campaigns/campaigns", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 200) {
        toast.success("✅ Campaign created successfully!");
        setCampaignName("");
        setSelectedFileName([]);
        fetchCampaigns();
      } else {
        const error = await res.json();
        toast.error(`❌ Failed to create campaign: ${error.message || "Server error"}`);
      }
    } catch (err) {
      console.error("Create error", err);
      toast.error("❌ Error creating campaign!");
    } finally {
      setCreating(false);
    }
  };

  const handleStartCampaign = async (campaignId) => {
    const confirmStart = window.confirm("Do you want to start this campaign? If you refresh, it may stop.");
    if (!confirmStart) return;
    setRunningCampaigns((prev) => [...prev, campaignId]);
    try {
      const res = await fetch(`https://3.95.238.222/api/campaigns/run-campaign/${campaignId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        toast.success("✅ Campaign started successfully!");
        fetchCampaigns();
      } else {
        toast.error("❌ Failed to start campaign.");
        setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
      }
    } catch (err) {
      console.error("Start campaign error", err);
      toast.error("❌ Error starting campaign!");
      setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
    }
  };

  const handleStopCampaign = async (campaignId) => {
    const confirmStop = window.confirm("Are you sure you want to stop this campaign?");
    if (!confirmStop) return;
    try {
      const res = await fetch(`https://3.95.238.222/api/campaigns/stop-campaign/${campaignId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        toast.success("✅ Campaign stopped successfully!");
        setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
        fetchCampaigns();
      } else {
        toast.error("❌ Failed to stop campaign.");
      }
    } catch (err) {
      console.error("Stop campaign error", err);
      toast.error("❌ Error stopping campaign!");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredCampaigns(campaigns.filter((c) => c.campaign_name?.toLowerCase().includes(value)));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">📊 Campaign Manager</h1>

      <div className="mb-6 max-w-xl mx-auto">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg mb-8">
          <select
            className="w-full p-2 mb-4 rounded bg-white/20 text-black dark:text-white"
            value={selectedBotId}
            disabled
          >
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.bot_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter campaign name..."
            className="w-full p-3 mb-4 rounded bg-white/20 text-black dark:text-white placeholder-gray-400"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />

          <select
            multiple
            className="w-full p-2 mb-4 rounded bg-white/20 text-black dark:text-white h-40"
            value={selectedFileName}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
              setSelectedFileName(selected);
            }}
          >
            {file_name.map((file, i) => (
              <option key={i} value={file}>
                {file}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            disabled={!campaignName || selectedFileName.length === 0 || creating}
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
              !campaignName || selectedFileName.length === 0 || creating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {creating ? "Creating..." : "Create Campaign"}
          </button>

          <p className="mt-3 text-xs text-gray-400">
            📅 Date & time will be auto-filled with the current system time.
          </p>
        </div>

        <div className="flex items-center -ml-96 bg-white/10 rounded-lg overflow-hidden shadow">
          <div className="px-3 text-white">
            <FaSearch />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search campaign by name..."
            className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 rounded-xl backdrop-blur-md">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="px-4 py-3">Sr No.</th>
              <th className="px-6 py-3">Campaign Name</th>
              <th className="px-6 py-3">Created Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((c, index) => (
              <tr key={c.campaign_id} className="hover:bg-white/10">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-6 py-3">{c.campaign_name}</td>
                <td className="px-6 py-3">
                  {new Date(c.campaign_scheduled_datetime).toLocaleString()}
                </td>
                <td className="px-6 py-3">{c.campaign_status || "Active"}</td>
                <td className="px-6 py-3 text-center">
                  {runningCampaigns.includes(c.campaign_id) ? (
                    <button
                      onClick={() => handleStopCampaign(c.campaign_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartCampaign(c.campaign_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Run Campaign
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
