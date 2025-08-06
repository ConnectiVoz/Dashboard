import React, { useEffect, useState } from "react";
import CallLogs from "./CallLogs"; // Table component

const CallLogsPage = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [selectedCalls, setSelectedCalls] = useState([]);

  const BASE_URL = "https://3.95.238.222/";

  // 1. Fetch all call logs
  const fetchCallLogs = async () => {
    try {
      const res = await fetch(`https://3.95.238.222/api/call-logs/list`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
       console.log("Token being used:", sessionStorage.getItem("token"));
       console.log("Response status:", res.status);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();
      setCallLogs(data.callLogs || []);
    } catch (err) {
      console.error("❌ fetchCallLogs error:", err);
    }
  };

  // 2. Add dummy call log
  const createDummyCallLog = async () => {
    try {
      await fetch(`https://3.95.238.222/api/call-logs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "9551234567",
          status: "Picked",
          duration: "3 min",
          time: "5:00 PM",
          date: "01/08/2025",
          campaignName: "August Campaign",
          agentName: "Manish",
          hasRecording: true,
        }),
      });
      fetchCallLogs();
    } catch (err) {
      console.error("❌ Error creating call log:", err);
    }
  };

  // 3. Upload dummy audio
  const uploadDummyAudio = async (callId) => {
    try {
      const formData = new FormData();
      formData.append("audio", new Blob(["FAKE_AUDIO"], { type: "audio/mpeg" }), "fake.mp3");

      await fetch(`https://3.95.238.222/api/call-logs/upload-recording?id=${callId}`, {
        method: "PUT",
        body: formData,
      });

      alert("✅ Audio uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  // 4. Download ZIP of all call logs
  const downloadZip = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/call-logs/download-zip`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "call_logs.zip");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ ZIP download failed:", err);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📞 Call Logs
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={createDummyCallLog}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Dummy Log
          </button>
          <button
            onClick={() => uploadDummyAudio(callLogs[0]?.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            ⬆ Upload Dummy Audio
          </button>
          <button
            onClick={downloadZip}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            📦 Download ZIP
          </button>
        </div>

        <CallLogs
          data={callLogs}
          selectedCalls={selectedCalls}
          setSelectedCalls={setSelectedCalls}
        />
      </div>
    </div>
  );
};

export default CallLogsPage;
