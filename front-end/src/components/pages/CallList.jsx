import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaDownload, FaSearch } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function CallSheet() {
  const [fileData, setFileData] = useState([]);
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [duplicateFileUrl, setDuplicateFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const expectedHeaders = ["Title", "First Name", "Last Name", "Phone"];

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetchWithAuth("https://rivoz.in/api/call_list/files");
      const data = await res.json();
      if (Array.isArray(data?.files)) {
        setFileData(data.files);
      }
    } catch (err) {
      console.error("❌ Failed to fetch file list", err);
    }
  };

  const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const uploadRes = await fetchWithAuth("https://rivoz.in/api/call_list/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadRes.ok) {
      console.log(uploadRes);
      toast.success("✅ File uploaded successfully");

      // If you need to parse JSON (e.g. duplicates)
      const resJson = await uploadRes.json();
      // If you want to handle duplicates, uncomment below:
      /*
      if (resJson.duplicates && resJson.duplicates.length > 0) {
        setDuplicateRows(resJson.duplicates);
        setDuplicateFileUrl(resJson.duplicate_file_url || "");
        setShowDuplicateModal(true);
      }
      */
      
      fetchFiles();
      setShowUploadModal(false);
      setSelectedFile(null);
    } else {
      const resJson = await uploadRes.json();
      console.log(resJson);
      toast.error("❌ Upload failed");
    }
  } catch (err) {
    console.error("❌ Upload failed", err);
    toast.error("❌ Upload failed due to network error");
  }
};


  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Allow only Excel or CSV
    const allowedExtensions = ["xlsx", "xls", "csv"];
    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error("❌ Only Excel (.xlsx, .xls) or CSV files are allowed");
      e.target.value = null; // Reset file input
      return;
    }

    setSelectedFile(file);
  };

  const processAndUploadFile = async () => {
    if (!selectedFile) {
      toast.error("❌ Please select a file first");
      return;
    }

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const fileHeaders = Object.keys(jsonData[0] || {});
      if (
        fileHeaders.length !== expectedHeaders.length ||
        !expectedHeaders.every((h, i) => h === fileHeaders[i])
      ) {
        toast.error("❌ Invalid format of file");
        return;
      }

      // ✅ Row limit check (only 10 rows allowed)
      if (jsonData.length > 10) {
        toast.error("❌ Row limit exceeded. Only 10 rows are allowed.");
        return;
      }

      uploadFile(selectedFile);
    } catch (err) {
      console.error("❌ Error processing file", err);
      toast.error("❌ Could not read file");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await fetchWithAuth(
        `https://rivoz.in/api/call_list/download/${encodeURIComponent(filename)}`,
        { method: "GET" }
      );

      if (!res.ok) {
        toast.error("❌ Download failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("❌ Error downloading file");
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetchWithAuth(`https://rivoz.in/api/call_list/delete/${filename}`, {
        method: "GET",
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
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">📁 Call Sheet Manager</h1>

      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-4">
        <div className="flex items-center bg-white/10 rounded-lg overflow-hidden shadow">
          <div className="px-3 text-white">
            <FaSearch />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name..."
            className="w-full px-3 py-2 sm:py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base flex items-center justify-center mx-auto"
          style={{ maxWidth: "220px" }}
        >
          <FaUpload className="inline-block mr-2" /> Upload Excel
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg text-black dark:text-white max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-3">📤 Upload Call List File</h2>
            <p className="mb-2 text-sm">
              Kindly use the sample template below to upload data. Any other template will not work
            </p>
            <a
              href="/sample_call_list.xlsx"
              download
              className="text-blue-500 underline text-sm mb-4 inline-block"
            >
              📎 Download Sample Template
            </a>

            {/* ✅ File type restricted */}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="w-full mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowUploadModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
              >
                Skip
              </button>
              <button
                onClick={processAndUploadFile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Upload Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg text-black dark:text-white max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-3">⚠️ Duplicate Data Found</h2>
            <p className="mb-4">Some rows already exist in the system.</p>
            <ul className="max-h-40 overflow-y-auto text-sm border p-2 rounded">
              {duplicateRows.map((row, idx) => (
                <li key={idx}>
                  {row["Title"]} {row["First Name"]} {row["Last Name"]} — {row["Phone"]} —{" "}
                  {row["Created At"]}
                </li>
              ))}
            </ul>
            {duplicateFileUrl && (
              <a
                href={duplicateFileUrl}
                download="duplicate_data.xlsx"
                className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                📥 Download Duplicate Excel
              </a>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table for md and up */}
      <div className="hidden md:block max-w-4xl mx-auto bg-white/10 p-4 rounded-xl backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4">📚 Uploaded Files</h2>
        <table className="w-full text-sm table-auto">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 text-left">Select</th>
              <th className="px-4 py-2 text-left">Sr No.</th>
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Download</th>
              <th className="px-4 py-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((f, idx) => (
              <tr key={idx} className="hover:bg-white/5">
                <td className="px-4 py-2">
                  <input type="checkbox" className="form-checkbox" disabled />
                </td>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">📄 {f}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDownload(f)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaDownload />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(f)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No files found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List view for small screens */}
      <div className="md:hidden max-w-xl mx-auto space-y-3">
        {filteredFiles.length === 0 && (
          <p className="text-center py-6 text-gray-500">No files found</p>
        )}
        {filteredFiles.map((f, idx) => (
          <div
            key={idx}
            className="bg-white/10 p-4 rounded-lg backdrop-blur-md flex flex-col space-y-2 text-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {idx + 1}. 📄 {f}
              </span>
              <input type="checkbox" className="form-checkbox" disabled />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleDownload(f)}
                className="text-green-500 hover:text-green-700 flex items-center space-x-1"
                aria-label={`Download ${f}`}
              >
                <FaDownload /> <span>Download</span>
              </button>
              <button
                onClick={() => handleDelete(f)}
                className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                aria-label={`Delete ${f}`}
              >
                <FaTrash /> <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
