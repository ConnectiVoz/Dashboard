import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaDownload, FaSearch } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";

export default function CallList() {
  const [fileData, setFileData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetchWithAuth("https://3.95.238.222/api/call_list/files");
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        setFileData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch file list", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetchWithAuth("https://3.95.238.222/api/call_list/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("✅ File uploaded");
        fetchFiles();
        setShowUploadModal(false);
      } else {
        toast.error("❌ Upload failed");
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `https://3.95.238.222/api/call_list/download/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetchWithAuth(`https://3.95.238.222/api/call_list/delete/${filename}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("✅ File deleted");
        fetchFiles();
      } else {
        toast.error("❌ Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filteredFiles = fileData.filter((f) => f.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">📁 Call List Manager</h1>

      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-4">
        <div className="flex items-center bg-white/10 rounded-lg overflow-hidden shadow">
          <div className="px-3 text-white"><FaSearch /></div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name..."
            className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          <FaUpload className="inline-block mr-2" /> Upload Excel
        </button>
      </div>

      {/* Modal for Upload Excel Instructions */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg text-black dark:text-white">
            <h2 className="text-2xl font-bold mb-3">📤 Upload Call List File</h2>
            <p className="mb-2 text-sm">Make sure your file includes columns: <strong>First Name</strong>, <strong>Last Name</strong>, <strong>Phone Number</strong>.</p>
            <a
              href="/sample_call_list.xlsx"
              download
              className="text-blue-500 underline text-sm mb-4 inline-block"
            >
              📎 Download Sample Template
            </a>

            <input type="file" onChange={handleFileChange} className="w-full mb-4" />

            <div className="flex justify-between">
              <button
                onClick={() => setShowUploadModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
              >
                Skip
              </button>
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Upload Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Table */}
      <div className="max-w-4xl mx-auto bg-white/10 p-4 rounded-xl backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4">📚 Uploaded Files</h2>
        <table className="w-full text-sm table-auto">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 text-left">Select</th>
              <th className="px-4 py-2 text-left">Sr No.</th>
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((f, idx) => (
              <tr key={idx} className="hover:bg-white/5">
                <td className="px-4 py-2">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">📄 {f}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleDownload(f)} className="text-green-500 hover:text-green-700">
                    <FaDownload />
                  </button>
                  <button onClick={() => handleDelete(f)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">No files found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
