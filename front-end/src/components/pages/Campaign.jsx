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
      e.returnValue =
        "Are you sure you want to leave? Your campaign will stop if you refresh.";
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
      const res = await fetchWithAuth(
        "https://3.95.238.222/api/call_list/files"
      );
      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (Array.isArray(data.files)) setFileName(data.files);
      else {
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
    const isDuplicate = campaigns.some(
      (c) => c.campaign_name?.toLowerCase() === campaignName.toLowerCase()
    );
    if (isDuplicate) {
      toast.info(
        <div>
          <p>⚠ This campaign name already exists!</p>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </div>,
        { autoClose: false }
      );
      return;
    }

    setCreating(true);
    const token = sessionStorage.getItem("token");

    function getISTDateTime(minutesToAdd = 0) {
      const date = new Date(Date.now() + minutesToAdd * 60 * 1000);
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(date.getTime() + istOffset);
      const year = istDate.getUTCFullYear();
      const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(istDate.getUTCDate()).padStart(2, "0");
      const hours = String(istDate.getUTCHours()).padStart(2, "0");
      const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
      const seconds = String(istDate.getUTCSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const payload = {
      bot_id: selectedBotId,
      call_list_file: selectedFileName,
      name: campaignName,
      scheduled_datetime: getISTDateTime(10),
    };

    try {
      const res = await fetch("https://3.95.238.222/api/campaigns/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("Content-Type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log("Response text:", text);
      }

      if (res.ok) {
        toast.success(data?.message || "✅ Campaign created successfully!");

        if (data?.["duplicate data skipped"]) {
          let duplicates = [];

          try {
            if (Array.isArray(data["duplicate data skipped"])) {
              duplicates = data["duplicate data skipped"];
            } else if (typeof data["duplicate data skipped"] === "string") {
              // Try to parse string safely
              const cleanStr = data["duplicate data skipped"]
                .replace(/'/g, '"')
                .replace(/None/g, "null");
              duplicates = JSON.parse(cleanStr);
            }
          } catch (e) {
            console.error(
              "Error parsing 'duplicate data skipped':",
              e,
              data["duplicate data skipped"]
            );
            toast.error("⚠️ Could not parse duplicate data info.");
          }

          console.log("Parsed duplicates:", duplicates);

          if (duplicates.length > 0) {
            const phoneSet = new Set();
            const uniqueDuplicates = duplicates.filter((d) => {
              if (!d.phone_number) return false;
              if (phoneSet.has(d.phone_number)) return false;
              phoneSet.add(d.phone_number);
              return true;
            });

            const duplicatesText = uniqueDuplicates
              .map(
                (d) =>
                  `${d.first_name || ""} ${d.last_name || ""} (${d.phone_number})`
              )
              .join("\n");

            toast.info(
              <div>
                <p>⚠ Duplicate data found (Phone Number Match):</p>
                <pre
                  className="whitespace-pre-wrap"
                  style={{
                    maxHeight: "600px",
                    minHeight: "300px",
                    maxWidth: "1000px",
                    overflowY: "auto",
                    overflowX: "auto",
                    padding: "20px",
                    backgroundColor: "#1e293b",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "white",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {duplicatesText}
                </pre>
                <button
                  onClick={() => toast.dismiss()}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    marginTop: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    border: "none",
                  }}
                >
                  OK
                </button>
              </div>,
              { autoClose: false, closeOnClick: false }
            );
          } else {
            console.log("No duplicates to show in toast.");
          }
        } else {
          console.log("No 'duplicate data skipped' in response.");
        }

        // Reset form & refresh campaigns
        setCampaignName("");
        setSelectedFileName([]);
        fetchCampaigns();
      } else {
        toast.error(`❌ Failed to create campaign: ${data?.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Create error", err);
      toast.error("❌ Network error while creating campaign!");
    } finally {
      setCreating(false);
    }
  };

  const handleStartCampaign = async (campaignId) => {
    const confirmStart = window.confirm(
      "Do you want to start this campaign?."
    );
    if (!confirmStart) return;
    setRunningCampaigns((prev) => [...prev, campaignId]);
    try {
      const res = await fetch(
        `https://3.95.238.222/api/campaigns/run-campaign/${campaignId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
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
      const res = await fetch(
        `https://3.95.238.222/api/campaigns/stop-campaign/${campaignId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
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
    setFilteredCampaigns(
      campaigns.filter((c) => c.campaign_name?.toLowerCase().includes(value))
    );
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

          {/* Helper text for multiple selection */}
          <p className="text-xs text-gray-400 mb-2">
            Select up to 2 files:
          </p>

          {/* Checkbox list for file selection */}
          <div className="mb-4 max-h-48 overflow-auto border rounded p-2 bg-white/20 text-black dark:text-white">
            {file_name.map((file, i) => {
              const isSelected = selectedFileName.includes(file);
              return (
                <label
                  key={i}
                  className={`block cursor-pointer select-none p-2 rounded mb-1 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100 dark:hover:bg-blue-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={file}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedFileName.length >= 2) {
                          toast.error("❌ You can select a maximum of 2 files only.");
                          return;
                        }
                        setSelectedFileName([...selectedFileName, file]);
                      } else {
                        setSelectedFileName(
                          selectedFileName.filter((f) => f !== file)
                        );
                      }
                    }}
                    className="mr-2 align-middle"
                  />
                  {file}
                </label>
              );
            })}
          </div>

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
                <td className="px-6 py-3">
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
