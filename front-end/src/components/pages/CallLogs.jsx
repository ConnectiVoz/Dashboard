import React from "react";

const CallLogs = ({ data, selectedCalls, setSelectedCalls }) => {
  const BASE_URL = "https://3.95.238.222/";
  const token = sessionStorage.getItem("token"); // or localStorage.getItem

  const handleCheckbox = (id) => {
    setSelectedCalls((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`https://3.95.238.222/api/call-logs/download-zip`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Token being used:", token);

      if (!res.ok) throw new Error("Failed to fetch recording");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recording_${id}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-900 shadow rounded">
      <table className="min-w-full text-sm text-gray-700 dark:text-gray-100">
        <thead className="bg-gray-200 dark:bg-zinc-800">
          <tr>
            <th className="p-3">Select</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Agent</th>
            <th className="p-3">Status</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Time</th>
            <th className="p-3">Date</th>
            <th className="p-3">Campaign</th>
            <th className="p-3">Recording</th>
          </tr>
        </thead>
        <tbody>
          {data.map((log) => (
            <tr key={log.id} className="border-b dark:border-zinc-700">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedCalls.includes(log.id)}
                  onChange={() => handleCheckbox(log.id)}
                />
              </td>
              <td className="p-2">{log.phoneNumber}</td>
              <td className="p-2">{log.agentName}</td>
              <td className="p-2">{log.status}</td>
              <td className="p-2">{log.duration}</td>
              <td className="p-2">{log.time}</td>
              <td className="p-2">{log.date}</td>
              <td className="p-2">{log.campaignName}</td>
              <td className="p-2">
                {log.hasRecording ? (
                  <div className="flex items-center gap-2">
                    <audio
                      controls
                      src={`${BASE_URL}/api/call-logs/play?id=${log.id}`}
                      className="w-32"
                    />
                    <button
                      onClick={() => handleDownload(log.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      ⬇ Download
                    </button>
                  </div>
                ) : (
                  <span className="text-red-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallLogs;
