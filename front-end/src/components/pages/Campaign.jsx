import React, { useState, useEffect } from "react";
import { FaSearch, FaUpload } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bots, setBots] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [showFileInput, setShowFileInput] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});
  const [selectedBotId, setSelectedBotId] = useState("");
  const [runningCampaigns, setRunningCampaigns] = useState([]);


  useEffect(() => {
    fetchCampaigns();
    fetchBots();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch("https://3.95.238.222/api/campaigns/list", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setCampaigns(list);
      setFilteredCampaigns(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
    setLoading(false);
  };

  const fetchBots = async () => {
    try {
      const response = await fetch("https://3.95.238.222/api/bots/list");
      const botsData = await response.json();
      if (Array.isArray(botsData)) setBots(botsData);
    } catch (error) {
      console.error("Error fetching bots:", error);
    }
  };

  const handleCreateCampaign = async () => {
    const payload = {
      bot_id: selectedBotId,
      name: campaignName,
      scheduled_datetime: scheduleDateTime,
    };
    try {
      const response = await fetch("https://3.95.238.222/api/campaigns/create", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create campaign");
      alert("Campaign created successfully!");
      fetchCampaigns();
    } catch (error) {
      console.error("Create campaign error:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = campaigns.filter((c) =>
      c.campaign_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCampaigns(filtered);
  };

  const handleCheckboxChange = (campaignId) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleUploadClick = () => {
    if (selectedCampaignIds.length === 0) {
      alert("Please select a campaign first to upload Excel.");
      return;
    }
    setShowFileInput(true);
  };

  const handleExcelUpload = async () => {
    if (selectedCampaignIds.length !== 1 || !excelFile) {
      alert("Please select exactly one campaign and choose a file to upload.");
      return;
    }

    setUploading(true);
    const campaignId = selectedCampaignIds[0];
    let fileName = excelFile.name;
    const existingFiles = uploadedFiles[campaignId] || [];

    if (existingFiles.includes(fileName)) {
      const base = fileName.replace(/(@\d+)?(\.\w+)$/, '');
      const ext = fileName.match(/\.\w+$/)[0];
      let counter = 1;
      while (existingFiles.includes(`${base}@${counter}${ext}`)) counter++;
      fileName = `${base}@${counter}${ext}`;
    }

    const renamedFile = new File([excelFile], fileName, { type: excelFile.type });
    const formData = new FormData();
    formData.append("file", renamedFile);

    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `https://3.95.238.222/api/campaigns/upload-excel/${campaignId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        alert("Excel uploaded successfully");
        setUploadedFiles((prev) => ({
          ...prev,
          [campaignId]: [...(prev[campaignId] || []), fileName],
        }));
        fetchCampaigns();
      } else {
        const errText = await res.text();
        console.error("Upload failed:", errText);
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }

    setUploading(false);
    setExcelFile(null);
    setShowFileInput(false);
  };

  const handleListPeople = async () => {
    if (selectedCampaignIds.length === 0) {
      const id = prompt("Enter Campaign ID:");
      if (!id) return;
      setSelectedCampaignIds([id]);
    }
    setLoading(true);
    try {
      const allPeople = [];
      for (const id of selectedCampaignIds) {
        const res = await fetchWithAuth(
          `https://3.95.238.222/api/campaigns/list-people?campaign_id=${id}`
        );
        const data = await res.json();
        if (Array.isArray(data?.data)) {
          const enrichedPeople = data.data.map((p) => ({
            ...p,
            campaign_id: id,
            source_file: p.source_file || "Unknown File",
          }));
          allPeople.push(...enrichedPeople);
        }
      }
      setPeopleList(allPeople);
    } catch (err) {
      console.error("List people error:", err);
    }
    setLoading(false);
  };
 const handleStartCampaign = async (campaignId) => {
    setRunningCampaigns((prev) => [...prev, campaignId]);
    try {
      const res = await fetch(
        `https://3.95.238.222/api/campaigns/run-campaign/${campaignId}`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      console.log("Start campaign response:", res);
      if (res.ok) {
        alert("Campaign started successfully!");
        fetchCampaigns();
      } else {
        alert("Failed to start campaign.");
        setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
      }
    } catch (err) {
      console.error("Start campaign error:", err);
      alert("Error starting campaign.");
      setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
    }
  };

  const handleStopCampaign = async (campaignId) => {
    try {
      const res = await fetch(
        `https://3.95.238.222/api/campaigns/stop-campaign/${campaignId}`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
      console.log("Stop campaign response:", res);
      setRunningCampaigns((prev) => prev.filter((id) => id !== campaignId));
      if (res.ok) {
        alert("Campaign stopped successfully!");
        fetchCampaigns();
      } else {
        alert("Failed to stop campaign.");
      }
    } catch (err) {
      console.error("Stop campaign error:", err);
      alert("Error stopping campaign.");
    }
  };
  const groupedPeople = peopleList.reduce((acc, person) => {
    const file = person.source_file || "Unknown File";
    acc[file] = acc[file] || [];
    acc[file].push(person);
    return acc;
  }, {});

  const toggleShowMore = (fileName) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Campaign Manager</h1>

      {/* Create Campaign Form */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <select
          className="border rounded p-2 text-black bg-white/10 backdrop-blur-md"
          value={selectedBotId}
          onChange={(e) => setSelectedBotId(e.target.value)}
        >
          <option value="">Select a bot</option>
          {bots.map((bot) => (
            <option key={bot.id} value={bot.id}>
              {bot.bot_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="px-4 py-2 bg-white/10 rounded-md"
        />
        <input
          type="datetime-local"
          value={scheduleDateTime}
          onChange={(e) => setScheduleDateTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="px-4 py-2 bg-white/10 rounded-md"
        />
        <button
          onClick={handleCreateCampaign}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          Create Campaign
        </button>
      </div>

      {/* Buttons Row */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search campaign by name..."
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md"
        />
        <div className="flex flex-col md:flex-row items-center gap-2">
          {!showFileInput && (
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              <FaUpload /> Upload Excel
            </button>
          )}
          {showFileInput && (
            <>
              <input
                type="file"
                onChange={(e) => setExcelFile(e.target.files[0])}
                className="text-sm text-white"
              />
              <button
                onClick={handleExcelUpload}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Upload File
              </button>
              <button
                onClick={() => {
                  setShowFileInput(false);
                  setExcelFile(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={handleListPeople}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            List People
          </button>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="overflow-x-auto bg-white/5 rounded-xl backdrop-blur-md mb-8">
        <table className="min-w-full table-auto">
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="px-4 py-3">Select</th>
              <th className="px-6 py-3">Sr No.</th>
              <th className="px-6 py-3">Call List</th>
              <th className="px-6 py-3">Campaign ID</th>
              <th className="px-6 py-3">Scheduled DateTime</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((c, index) => (
              <tr key={c.campaign_id} className="hover:bg-white/10">
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedCampaignIds.includes(c.campaign_id)}
                    onChange={() => handleCheckboxChange(c.campaign_id)}
                  />
                </td>
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{c.campaign_name}</td>
                <td className="px-6 py-3">{c.campaign_id}</td>
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
                <td colSpan="7" className="text-center py-6">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* People Table */}
      {peopleList.length > 0 && (
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4">👥 People Grouped by File</h2>
          {Object.entries(groupedPeople).map(([fileName, group]) => {
            const showAll = expandedFiles[fileName];
            const visible = showAll ? group : group.slice(0, 5);
            return (
              <div key={fileName} className="mb-6">
                <h3 className="text-lg mb-2">📄 {fileName}</h3>
                <table className="w-full table-auto mb-2 text-left">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-2">First Name</th>
                      <th className="px-4 py-2">Last Name</th>
                      <th className="px-4 py-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((person, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-4 py-2">{person.first_name}</td>
                        <td className="px-4 py-2">{person.last_name}</td>
                        <td className="px-4 py-2">{person.phone_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {group.length > 5 && (
                  <button
                    className="text-blue-400 hover:underline text-sm"
                    onClick={() => toggleShowMore(fileName)}
                  >
                    {showAll ? "Show Less" : `Show More (${group.length - 5} more)`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
