import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

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
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    fetchBots();
    fetchCampaigns();
    fetchCallLists();
    fetchCallLogs();
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
      const res = await fetch("https://rivoz.in/api/bots/list");
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
        "https://rivoz.in/api/call_list/files"
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

  // Added: fetch call logs function
  const fetchCallLogs = async () => {
    try {
      const res = await fetchWithAuth("https://rivoz.in/api/call-logs/list");
      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (Array.isArray(data)) setCallLogs(data);
      else {
        toast.error("Call logs data format invalid.");
        console.error("Call logs data format invalid:", data);
      }
    } catch (err) {
      console.error("Call logs fetch error", err);
      toast.error("Failed to fetch call logs.");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("https://rivoz.in/api/campaigns/list", {
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
      const res = await fetch("https://rivoz.in/api/campaigns/create", {
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

        // ** Duplicate data excel download logic starts here **
        if (data?.["duplicate data skipped"]) {
          let duplicates = [];

          try {
            if (Array.isArray(data["duplicate data skipped"])) {
              duplicates = data["duplicate data skipped"];
            } else if (typeof data["duplicate data skipped"] === "string") {
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

          if (duplicates.length > 0) {
            // Remove duplicate phones if any
            const phoneSet = new Set();
            const uniqueDuplicates = duplicates.filter((d) => {
              if (!d.phone) return false;
              if (phoneSet.has(d.phone)) return false;
              phoneSet.add(d.phone);
              return true;
            });

            // Map to excel columns
            const worksheetData = uniqueDuplicates.map((d) => ({
              Title: d.title || "",
              "First Name": d.first_name || "",
              "Last Name": d.last_name || "",
              Phone: d.phone || "",
              "Created At": d.created_at || "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Duplicates");

            XLSX.writeFile(workbook, `duplicate_data_${Date.now()}.xlsx`);

            toast.info("⚠ Duplicate data found. Excel download started.");
          }
        }
        // ** Duplicate data excel download logic ends here **

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
    const confirmStart = window.confirm("Do you want to start this campaign?.");
    if (!confirmStart) return;
    setRunningCampaigns((prev) => [...prev, campaignId]);
    try {
      const res = await fetch(
        `https://rivoz.in/api/campaigns/run-campaign/${campaignId}`,
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
        `https://rivoz.in/api/campaigns/stop-campaign/${campaignId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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

  const handleDownloadCallLogs = (campaign) => {
    const logsForCampaign = callLogs.filter((log) => {
      if (log.bot_id && campaign.bot_id) {
        return log.bot_id === campaign.bot_id;
      }
      return (
        log.name?.toLowerCase() === campaign.name?.toLowerCase()
      );
    });

    if (logsForCampaign.length === 0) {
      toast.info("No call logs available for this campaign.");
      return;
    }

    const sheetData = logsForCampaign.map((log) => ({
      "Name": `${log.person.first_name} ${log.person.last_name}` || "",
      "Phone": log.person.phone_number || "",
      "Status": log.status || "",
      "Call Date ": log.call_date || "",
      "End Time": log.end_time && log.end_time !== "" ? log.end_time : "---" || "",
      "Start Time": log.start_time || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Logs");

    XLSX.writeFile(workbook, `${campaign.campaign_name}_call_logs_${Date.now()}.xlsx`);

    toast.success(`Call logs for "${campaign.campaign_name}" downloaded!`);
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

          <p className="text-xs text-gray-400 mb-2">Select up to 2 files:</p>

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
                        setSelectedFileName(selectedFileName.filter((f) => f !== file));
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

        <div className="flex items-center bg-white/10 rounded-lg overflow-hidden shadow mb-6 max-w-xl mx-auto">
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

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white/5 rounded-xl backdrop-blur-md max-w-full mx-auto">
        <table className="min-w-[700px] table-auto text-sm">
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="px-4 py-3 hidden sm:table-cell">Sr No.</th>
              <th className="px-6 py-3">Campaign Name</th>
              <th className="px-6 py-3 hidden md:table-cell">Created Time</th>
              <th className="px-6 py-3 hidden md:table-cell">Status</th>
              <th className="px-6 py-3">Actions</th>
              <th className="px-7 py-3">Call Logs</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((c, index) => (
              <tr
                key={c.campaign_id}
                className="hover:bg-white/10 flex flex-col sm:table-row mb-4 sm:mb-0 rounded-lg sm:rounded-none p-4 sm:p-0"
              >
                <td className="px-4 py-3 hidden sm:table-cell">{index + 1}</td>
                <td className="px-6 py-3 font-semibold">{c.campaign_name}</td>
                <td className="px-6 py-3 hidden md:table-cell">
                  {new Date(c.campaign_scheduled_datetime).toLocaleString()}
                </td>
                <td className="px-6 py-3 hidden md:table-cell">
                  {(c.campaign_status || "Active").charAt(0).toUpperCase() +
                    (c.campaign_status || "Active").slice(1)}
                </td>
                <td className="px-6 py-3">
                  {runningCampaigns.includes(c.campaign_id) ? (
                    <button
                      onClick={() => handleStopCampaign(c.campaign_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mb-2 sm:mb-0"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartCampaign(c.campaign_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mb-2 sm:mb-0"
                    >
                      Run Campaign
                    </button>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    title={`Download call logs for ${c.campaign_name}`}
                    onClick={() => handleDownloadCallLogs(c)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaDownload size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
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