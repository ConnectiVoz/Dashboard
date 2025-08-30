import React, { useEffect, useState } from "react";
import { FaDownload, FaPlay, FaPause } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

export default function CallLogsTable() {
  const [fatalError, setFatalError] = useState(null);
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [campaignFilter, setCampaignFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [openSummaryId, setOpenSummaryId] = useState(null);
  const [sentiments, setSentiments] = useState({});
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  

  const campaignNames = [
    "All",
    ...Array.from(new Set(callLogs.map((log) => log.campaign).filter(Boolean))),
  ];

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
        const res = await fetchWithAuth(`https://rivoz.in/api/call-logs/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        const logs = Array.isArray(data)
          ? data
          : data.data || data.callLogs || [];
        setCallLogs(logs);
        setFilteredLogs(logs);
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        toast.error("Failed to fetch call logs.");
      }
    };
    fetchCallLogs();
  }, []);
if (fatalError) {
    return (
      <div style={{ color: "red", fontWeight: "bold", padding: "20px" }}>
        {fatalError}
      </div>
    );
  }
  useEffect(() => {
    let filtered = callLogs.filter(
      (log) =>
        (log.person.first_name &&
          log.person.first_name.toLowerCase().includes(search.toLowerCase())) ||
        (log.person.last_name &&
          log.person.last_name.toLowerCase().includes(search.toLowerCase())) ||
        (log.person.phone_number &&
          log.person.phone_number
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (log.campaign &&
          log.campaign.toLowerCase().includes(search.toLowerCase())) ||
        (log.call_date && log.call_date.includes(search)) ||
        (log.status &&
          log.status.toLowerCase().includes(search.toLowerCase())) ||
        (log.start_time && log.start_time.includes(search)) ||
        (log.end_time && log.end_time.includes(search)) ||
        (log.sentiment &&
          log.sentiment.toLowerCase().includes(search.toLowerCase()))
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (log) =>
          log.status === statusFilter ||
          (statusFilter === "Not Picked" && log.status === "Ring")
      );
    }

    if (campaignFilter !== "All") {
      filtered = filtered.filter((log) => log.campaign === campaignFilter);
    }

    if (sentimentFilter !== "All") {
      filtered = filtered.filter((log) => log.sentiment === sentimentFilter);
    }

    setFilteredLogs(filtered);
    // eslint-disable-next-line
  }, [search, statusFilter, campaignFilter, callLogs, sentimentFilter]);

  const handleDownloadByUrl = async (url, id) => {
    try {
      const res = await fetch(
        `https://rivoz.in/api/call-logs/download-recording/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to download recording.");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `call_recording_${id}.mp3`;
      a.click();
      a.remove();
      toast.success("Recording downloaded successfully!");
    } catch (err) {
      toast.error("Download failed. Please try again.");
      console.error("Recording download failed:", err);
    }
  };

  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const handlePlayPause = (url, id) => {
    if (currentAudio && playingId === id) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingId(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.play().catch(() => toast.error("Unable to play audio."));
    setCurrentAudio(audio);
    setPlayingId(id);

    audio.onended = () => {
      setCurrentAudio(null);
      setPlayingId(null);
    };
  };

  const downloadTranscript = (log) => {
    if (!log.conversation || log.conversation.length === 0) {
      return toast.info("No transcript available.");
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("📄 Call Transcript", 10, 15);
    let y = 30;
    log.conversation.forEach((msg) => {
      const prefix = msg.role === "assistant" ? "AI:" : "User:";
      const lines = doc.splitTextToSize(`${prefix} ${msg.content}`, 180);
      lines.forEach((line) => {
        doc.text(line, 10, y);
        y += 8;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    });
    doc.save(
      `Call_Transcript_${log.person?.first_name || "Unknown"}_${
        log.person?.last_name || ""
      }.pdf`
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Connected":
        return (
          <span className="text-green-500 font-semibold">✅ Connected</span>
        );
      case "Missed":
        return <span className="text-red-500 font-semibold">❌ Missed</span>;
      case "Pending":
        return (
          <span className="text-yellow-500 font-semibold">🕒 Pending</span>
        );
      case "Ring":
        return (
          <span className="text-gray-400 font-semibold">⚠️ Not Picked</span>
        );
      default:
        return status;
    }
  };

  // Helper: Generate summary text
  const getCallSummary = (log) => {
    let summary = `Agent connected the call on ${log.person?.phone_number} . `;
    if (log.status === "Connected") {
      summary += "User picked up the call. ";
      if (log.conversation && log.conversation.length > 0) {
        const appointmentMsg = log.conversation.find(
          (msg) =>
            msg.content &&
            (msg.content.toLowerCase().includes("appointment") ||
              msg.content.toLowerCase().includes("book"))
        );
        if (appointmentMsg) {
          summary += `Appointment is booked by user on ${log.call_date_time} `;
        } else {
          summary +=
            "The user did not book the appointment and disconnected the call";
        }
      }
    } else if (log.status === "Missed" || log.status === "Ring") {
      summary += "The user did not pick up the call or declined it.";
    } else {
      summary += "Call status: " + log.status;
    }
    return summary;
  };

  // ✅ Fixed fetchSentiment (now accepts log and updates state)
// const [fatalError, setFatalError] = useState(null);

const fetchSentiment = async (log) => {
  if (!log.call_recording) return console.warn("No recording URL for log:", log.id);
  const token = sessionStorage.getItem("token");

  try {
    setLoadingSentiment(log.id);

    const res = await fetch(
      `https://rivoz.in/api/call-logs/get_sentiment?call_recording_url=${encodeURIComponent(log.call_recording)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch sentiment (${res.status})`);
    }

    const data = await res.json();
    console.log("✅ Sentiment result:", data);

    const raw = data || data?.Overall_Sentiment || "";
    const clean = (raw.match(/(Positive|Negative|Neutral)/i) || [])[0] || "Not Found";

    setSentiments((p) => ({ ...p, [log.id]: clean }));
  } catch (e) {
    console.error("❌ Error fetching sentiment:", e);
    setFatalError("Something went wrong while fetching sentiment!");
  } finally {
    setLoadingSentiment(null);
  }
};


  // Sentiment filter options
  const SENTIMENTS = ["All", "Positive", "Negative", "Neutral", "Attitude"];

  return (
    <div className="p-4 min-h-screen bg-white text-black dark:bg-[#0f172a] dark:text-white transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6">📞 Call Summary</h1>

      {/* Filters */}
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
          <select
            className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
          >
            {campaignNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sentiment Filter above table */}
      <div className="flex justify-end mb-2">
        <select
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
        >
          {SENTIMENTS.map((sent, i) => (
            <option key={i} value={sent}>
              {sent}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto shadow rounded-xl border dark:border-gray-700 border-gray-200 hidden md:block">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Call Date</th>
              <th className="p-2">Campaign</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              <th className="p-2">Actions</th>
              <th className="p-2">Show Summary</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  No call logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, i) => (
                <React.Fragment key={i}>
                  <tr className="border-t border-gray-300 dark:border-gray-700">
                    <td className="p-2">{`${log.person.first_name} ${log.person.last_name}`}</td>
                    <td className="p-2">{log.person.phone_number}</td>
                    <td className="p-2">{getStatusLabel(log.status)}</td>
                    <td className="p-2">{log.call_date}</td>
                    <td className="p-2">{log.campaign}</td>
                    <td className="p-2">{log.start_time || "---"}</td>
                    <td className="p-2">{log.end_time || "---"}</td>
                    <td className="p-2 flex gap-3">
                      {log.call_recording ? (
                        <>
                          <button
                            onClick={() =>
                              handlePlayPause(log.call_recording, log.id)
                            }
                            className={`${
                              playingId === log.id
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                            title={
                              playingId === log.id
                                ? "Pause Recording"
                                : "Play Recording"
                            }
                          >
                            {playingId === log.id ? <FaPause /> : <FaPlay />}
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadByUrl(log.call_recording, log.id)
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="Download Recording"
                          >
                            <FaDownload />
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">No recording</span>
                      )}
                      <button
                        onClick={() => downloadTranscript(log)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Download Transcript"
                      >
                        📝
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setOpenSummaryId(
                            openSummaryId === log.id ? null : log.id
                          );
                          if (!sentiments[log.id]) fetchSentiment(log);
                        }}
                        className={`px-3 py-1 rounded-full font-semibold transition-colors duration-150 ${
                          openSummaryId === log.id
                            ? "bg-orange-100 text-blue-700 border border-blue-400 rounded-full"
                            : "bg-blue-600 text-white hover:bg-blue-700 rounded-full"
                        }`}
                        title={
                          openSummaryId === log.id
                            ? "Hide Call Summary"
                            : "Show Call Summary"
                        }
                      >
                        {openSummaryId === log.id
                          ? "Hide Summary"
                          : "Show Summary"}
                      </button>
                    </td>
                  </tr>
                  {openSummaryId === log.id && (
                    <tr>
                      <td
                        colSpan={10}
                        className="bg-gray-50 dark:bg-gray-900 p-0"
                      >
                        <div className="w-full px-6 py-4">
                          <div className="font-bold text-lg mb-2">
                            Call Summary
                          </div>
                          <div
                            className="max-h-40 overflow-y-auto rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
                            style={{ minHeight: "60px" }}
                          >
                            <div className="mb-2">
                              {(() => {
                                if (
                                  log.status === "Connected" &&
                                  log.conversation &&
                                  log.conversation.length > 0
                                ) {
                                  const appointmentMsg = log.conversation.find(
                                    (msg) =>
                                      msg.content &&
                                      (msg.content
                                        .toLowerCase()
                                        .includes("appointment") ||
                                        msg.content
                                          .toLowerCase()
                                          .includes("book"))
                                  );
                                  if (appointmentMsg) {
                                    return (
                                      <span>
                                        <b>Appointment is booked by user on:</b>{" "}
                                        {log.call_date} at {log.start_time} -{" "}
                                        {log.end_time}
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span>
                                        <b>Appointment:</b> User
                                        disconnected the call without booking.
                                      </span>
                                    );
                                  }
                                } else if (
                                  log.status === "Missed" ||
                                  log.status === "Ring"
                                ) {
                                  return (
                                    <span>
                                      <b>Appointment Booked:</b> No (User did
                                      not pick up or declined)
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span>
                                      <b>Appointment is booked by user:</b>{" "}
                                      No(User did not pick up or disconnected)
                                    </span>
                                  );
                                }
                              })
                              ()
                              
                              }
                              <div className="mt-2">
                              <b>Sentiment:</b>{" "}
                              {sentiments[log.id]
                                ? sentiments[log.id]
                                : log.call_recording
                                ? "Fetching..."
                                : "Not Available"}
                            </div>
                            </div>
                            
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile/Table view for call logs */}
      <div className="md:hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No call logs found.
          </div>
        ) : (
          filteredLogs.map((log, i) => (
            <div
              key={i}
              className="mb-4 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-bold text-lg">{`${log.person.first_name} ${log.person.last_name}`}</div>
                  <div className="text-gray-500 text-sm">
                    {log.person.phone_number}
                  </div>
                </div>
                <div>{getStatusLabel(log.status)}</div>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Date:</span> {log.call_date}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Campaign:</span> {log.campaign}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Start:</span>{" "}
                {log.start_time || "---"}
                {" | "}
                <span className="font-semibold">End:</span>{" "}
                {log.end_time || "---"}
              </div>
              <div className="flex gap-3 mt-2">
                {log.call_recording ? (
                  <>
                    <button
                      onClick={() =>
                        handlePlayPause(log.call_recording, log.id)
                      }
                      className={`${
                        playingId === log.id
                          ? "text-red-600 hover:text-red-800"
                          : "text-green-600 hover:text-green-800"
                      }`}
                      title={
                        playingId === log.id
                          ? "Pause Recording"
                          : "Play Recording"
                      }
                    >
                      {playingId === log.id ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadByUrl(log.call_recording, log.id)
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Download Recording"
                    >
                      <FaDownload />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400">No recording</span>
                )}
                <button
                  onClick={() => downloadTranscript(log)}
                  className="text-purple-600 hover:text-purple-800"
                  title="Download Transcript"
                >
                  📝
                </button>
              </div>
              <div className="mt-3">
                {openSummaryId === log.id ? (
                  <div>
                    <div className="font-bold mb-1">Call Summary</div>
                    <div className="mb-2">{getCallSummary(log)}</div>
                    <div className="mb-2">
                      <b>Sentiment:</b>{" "}
                      {sentiments[log.id]
                        ? sentiments[log.id]
                        : log.call_recording
                        ? "Loading..."
                        : "Not Available"}
                    </div>
                    <button
                      onClick={() => setOpenSummaryId(null)}
                      className="text-blue-600 hover:text-green-800 font-semibold mt-2"
                      title="Hide Call Summary"
                    >
                      Hide Summary
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenSummaryId(log.id);
                      if (!sentiments[log.id]) fetchSentiment(log);
                    }}
                    className="text-blue-600 hover:text-green-800 font-semibold"
                    title="Show Call Summary"
                  >
                    Show Summary
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
