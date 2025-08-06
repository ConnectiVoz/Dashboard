import React, { useEffect, useState } from "react";

const API_BASE = "https://3.95.238.222/api/bots";

function KnowledgeBase() {
  const [kbData, setKbData] = useState([]);
  const [kbId, setKbId] = useState("");
  const [pages, setPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [file, setFile] = useState(null);

  const isAdmin = sessionStorage.getItem("role") === "admin";

  const fetchKbDetails = async () => {
    if (!kbId) return;
    try {
      const res = await fetch(
        `${API_BASE}/kb-details?bot_id=${kbId}&pages=${pages}&per_page=${perPage}`
      );
      const data = await res.json();
      setKbData(data?.data || []);
    } catch (err) {
      console.error("Error fetching KB:", err);
    }
  };

  const handleFileUpload = async () => {
    if (!isAdmin) {
      alert("Only admin users are allowed to upload knowledge base.");
      return;
    }

    if (!file || !kbId) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bot_id", kbId);
    try {
      await fetch(`${API_BASE}/upload-kb`, {
        method: "POST",
        body: formData,
      });
      fetchKbDetails();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  useEffect(() => {
    fetchKbDetails();
  }, [kbId, pages, perPage]);

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Knowledge Base</h2>

      <div className="mb-6 flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="mb-1 text-gray-400">KB ID</label>
          <input
            type="text"
            placeholder="Enter Bot ID"
            value={kbId}
            onChange={(e) => setKbId(e.target.value)}
            className="p-2 rounded text-black w-48"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-400">Pages</label>
          <input
            type="number"
            min={1}
            placeholder="Pages"
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            className="p-2 rounded text-black w-24"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-400">Per Page</label>
          <input
            type="number"
            min={1}
            placeholder="Per Page"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="p-2 rounded text-black w-24"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-400">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-2 rounded text-black"
          />
        </div>

        <button
          onClick={handleFileUpload}
          className={`text-white px-5 py-2 rounded h-10 self-start ${
            isAdmin ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Upload
        </button>
      </div>

      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3 text-gray-400 text-left">Title</th>
            <th className="p-3 text-gray-400 text-left">Author</th>
            <th className="p-3 text-gray-400 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {kbData.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            kbData.map((kb, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-700 hover:bg-gray-750"
              >
                <td className="p-3">{kb.title || "Untitled"}</td>
                <td className="p-3">{kb.author || "Unknown"}</td>
                <td className="p-3">{kb.created_at?.split("T")[0]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default KnowledgeBase;
