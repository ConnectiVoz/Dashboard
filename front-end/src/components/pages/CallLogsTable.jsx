import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";

export default function CallLogsTable() {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCallLogs = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");
      const res = await fetchWithAuth(`https://3.95.238.222/api/call-logs/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await res.text();
        throw new Error("Expected JSON, got: " + errorText);
      }

      const data = await res.json();
      const logs = Array.isArray(data) ? data : data.data || data.callLogs || [];
      setCallLogs(logs);
      setFilteredLogs(logs);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      toast.error("Failed to fetch call logs.");
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
      filtered = filtered.filter(
        (log) => log.status === statusFilter || (statusFilter === "Not Picked" && log.status === "Ring")
      );
    }
    setFilteredLogs(filtered);
  }, [search, statusFilter, callLogs]);

  const handleDownloadByUrl = (url, id) => {
    if (!url || url === "null") {
      toast.info("No recording available to download.");
      return;
    }
    // download logic
    fetch(`https://3.95.238.222/api/call-logs/download-recording/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to download recording.");
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `call_recording_${id}.mp3`;
        a.click();
        a.remove();
        toast.success("Recording downloaded successfully!");
      })
      .catch((err) => {
        toast.error("Download failed. Please try again.");
        console.error("Recording download failed:", err);
      });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Connected":
        return (
          <span className="text-green-500 font-semibold">
            ✅ Connected
          </span>
        );
      case "Missed":
        return (
          <span className="text-red-500 font-semibold">
            ❌ Missed
          </span>
        );
      case "Pending":
        return (
          <span className="text-yellow-500 font-semibold">
            🕒 Pending
          </span>
        );
      case "Ring":
        return (
          <span className="text-gray-400 font-semibold">
            ⚠️ Not Picked
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="p-4 min-h-screen bg-white text-black dark:bg-[#0f172a] dark:text-white transition-all duration-300">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by any field..."
            className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 w-full md:w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Connected">Connected</option>
            <option value="Missed">Missed</option>
            <option value="Pending">Pending</option>
            <option value="Not Picked">Not Picked</option>
          </select>
        </div>
      </div>

      {/* Table View (Desktop) */}
      <div className="overflow-x-auto shadow rounded-xl border dark:border-gray-700 border-gray-200 hidden md:block">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Call Date</th>
              <th className="p-2">Campaign Name</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              <th className="p-2">Call Recording</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <td className="p-2">{`${log.person.first_name} ${log.person.last_name}`}</td>
                <td className="p-2">{log.person.phone_number}</td>
                <td className="p-2">{getStatusLabel(log.status)}</td>
                <td className="p-2">{log.call_date}</td>
                <td className="p-2">{log.campaign}</td>
                <td className="p-2">{log.start_time}</td>
                <td className="p-2">
                  {log.end_time && log.end_time !== ""
                    ? log.end_time
                    : "---"}
                </td>
                <td className="p-2">
                  {log.call_recording && log.call_recording !== "null" ? (
                    <button
                      onClick={() => handleDownloadByUrl(log.call_recording, log.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download recording"
                    >
                      <FaDownload />
                    </button>
                  ) : (
                    <button
                      disabled
                      onClick={() => toast.info("No recording available to download.")}
                      className="text-gray-400 cursor-not-allowed flex items-center gap-1"
                      title="No recording available"
                    >
                      <FaDownload />
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredLogs.map((log, index) => (
          <div
            key={index}
            className="bg-white/70 dark:bg-black/60 backdrop-blur-md border border-gray-300 dark:border-gray-600 shadow-xl rounded-2xl p-4 transition-transform transform hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">
                Call #{log.id}
              </h3>
              {getStatusLabel(log.status)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200">
              <div>
                <strong>Name:</strong> {`${log.person.first_name} ${log.person.last_name}`}
              </div>
              <div>
                <strong>Phone:</strong> {log.person.phone_number}
              </div>
              <div>
                <strong>Campaign:</strong> {log.campaign}
              </div>
              <div>
                <strong>Call Date:</strong> {log.call_date}
              </div>
              <div>
                <strong>Start Time:</strong> {log.start_time}
              </div>
              <div>
                <strong>End Time:</strong>{" "}
                {log.end_time && log.end_time !== "" ? "---" : log.end_time}
                { !log.end_time || log.end_time === "" ? "---" : log.end_time }
              </div>
            </div>
            <div className="mt-3 text-sm">
              <strong>Recording:</strong>{" "}
              {log.call_recording && log.call_recording !== "null" ? (
                <button
                  onClick={() => handleDownloadByUrl(log.call_recording, log.id)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <FaDownload />
                  <span className="text-sm">Download</span>
                </button>
              ) : (
                <button
                  disabled
                  onClick={() => toast.info("No recording available to download.")}
                  className="text-gray-400 cursor-not-allowed flex items-center gap-2"
                >
                  <FaDownload />
                  <span className="text-sm">Download</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
