import React, { useEffect, useState } from "react";
import { FaDownload, FaUpload, FaPlus, FaBars } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export default function CallLogsTable() {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [downloadId, setDownloadId] = useState("");
  const [formData, setFormData] = useState({
    from_phnumber: "",
    to_phnumber: "",
    name: "",
    email: "",
    status: "Connected",
    call_date: "",
    call_time: "",
    campaign: 0,
    agent: "",
    duration: 0,
    call_recording: "",
  });

  const fetchCallLogs = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetchWithAuth("https://3.95.238.222/api/call-logs/list", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const contentType = res.headers.get("content-type");
      if (!contentType.includes("application/json")) {
        throw new Error("Non-JSON response");
      }
      const data = await res.json();
      setCallLogs(data.data || []);
      setFilteredLogs(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  useEffect(() => {
    let filtered = callLogs.filter((log) =>
      Object.values(log).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
    );
    if (statusFilter !== "All") {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }
    setFilteredLogs(filtered);
  }, [search, statusFilter, callLogs]);

  const handleCreate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("https://4d25f682564f.ngrok-free.app/api/call-logs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowCreateForm(false);
        setFormData({
          from_phnumber: "",
          to_phnumber: "",
          name: "",
          email: "",
          status: "Connected",
          call_date: "",
          call_time: "",
          campaign: 0,
          agent: "",
          duration: 0,
          call_recording: "",
        });
        fetchCallLogs();
      }
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleUpload = async () => {
    try {
      const form = new FormData();
      form.append("id", uploadId);
      form.append("recording", uploadFile);
      const token = sessionStorage.getItem("token");
      const res = await fetch("https://4d25f682564f.ngrok-free.app/api/call-logs/upload-recording", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        setShowUpload(false);
        setUploadId("");
        setUploadFile(null);
        fetchCallLogs();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `https://4d25f682564f.ngrok-free.app/api/call-logs/download/${downloadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `call_recording_${downloadId}.mp3`;
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-white text-black dark:bg-[#0f172a] dark:text-white transition-all duration-300">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 w-full md:w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Connected">Connected</option>
            <option value="Missed">Missed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Create
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUpload /> Upload
          </button>
          <input
            type="text"
            placeholder="ID"
            value={downloadId}
            onChange={(e) => setDownloadId(e.target.value)}
            className="px-2 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-2 md:hidden mb-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Create Call Log
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUpload /> Upload Recording
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ID"
              value={downloadId}
              onChange={(e) => setDownloadId(e.target.value)}
              className="flex-1 px-2 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type={key.includes("date") ? "date" : key.includes("time") ? "time" : "text"}
              placeholder={key}
              value={formData[key]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="p-2 rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
            />
          ))}
          <button
            onClick={handleCreate}
            className="col-span-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      {showUpload && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          <input
            type="text"
            placeholder="Enter Call Log ID"
            value={uploadId}
            onChange={(e) => setUploadId(e.target.value)}
            className="mb-2 p-2 w-full rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
          />
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files[0])}
            className="mb-2 p-2 w-full rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={handleUpload}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full"
          >
            Upload
          </button>
        </div>
      )}
{/* Table View (for Desktop Only) */}
<div className="overflow-x-auto shadow rounded-xl border dark:border-gray-700 border-gray-200 hidden md:block">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
      <tr>
        <th className="p-2">Name</th>
        <th className="p-2">From</th>
        <th className="p-2">To</th>
        <th className="p-2">Email</th>
        <th className="p-2">Status</th>
        <th className="p-2">Date</th>
        <th className="p-2">Time</th>
        <th className="p-2">Campaign</th>
        <th className="p-2">Agent</th>
        <th className="p-2">Duration</th>
        <th className="p-2">Recording</th>
      </tr>
    </thead>
    <tbody>
      {filteredLogs.map((log, i) => (
        <tr
          key={i}
          className="border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          <td className="p-2">{log.name}</td>
          <td className="p-2">{log.from_phnumber}</td>
          <td className="p-2">{log.to_phnumber}</td>
          <td className="p-2">{log.email}</td>
          <td className="p-2">{log.status}</td>
          <td className="p-2">{log.call_date}</td>
          <td className="p-2">{log.call_time}</td>
          <td className="p-2">{log.campaign}</td>
          <td className="p-2">{log.agent}</td>
          <td className="p-2">{log.duration}</td>
          <td className="p-2 text-blue-500">{log.call_recording}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile View - Card Format */}
<div className="md:hidden space-y-4">
  {filteredLogs.map((log, index) => (
    <div
      key={index}
      className="bg-white/70 dark:bg-black/60 backdrop-blur-md border border-gray-300 dark:border-gray-600 shadow-xl rounded-2xl p-4 transition-transform transform hover:scale-[1.01]"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">{log.name}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            log.status === "Connected"
              ? "bg-green-100 text-green-700"
              : log.status === "Missed"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {log.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
        <div><strong>From:</strong> {log.from_phnumber}</div>
        <div><strong>To:</strong> {log.to_phnumber}</div>
        <div><strong>Email:</strong> {log.email}</div>
        <div><strong>Date:</strong> {log.call_date}</div>
        <div><strong>Time:</strong> {log.call_time}</div>
        <div><strong>Agent:</strong> {log.agent}</div>
        <div><strong>Campaign:</strong> {log.campaign}</div>
        <div><strong>Duration:</strong> {log.duration} sec</div>
      </div>
      <div className="mt-3 text-sm">
        <strong>Recording:</strong>{" "}
        <span className="text-blue-600 break-words">{log.call_recording}</span>
      </div>
    </div>
  ))}
</div>
</div>
      
  )}