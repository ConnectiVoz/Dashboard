import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    console.log("Token from URL:", tokenFromURL);
    if (!tokenFromURL) {
      setMessage("No token provided in URL.");
      return;
    }
    if (tokenFromURL) setToken(tokenFromURL);
  }, [searchParams]);
 const backendURL = "https://3.95.238.222";
  const handleReset = async (e) => {
    e.preventDefault();

    if (!token || !newPassword) {
      setMessage("Token and password are required.");
      return;
    }
      // const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(`https://3.95.238.222/api/user/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
         },
        body: JSON.stringify({
          token:token,
          new_password: newPassword,
        }),
      });
      console.log("Response status:", res.status); // Log the response status
      console.log("Response URL:", res.url); // Log the response URL
      console.log("Request body:", JSON.stringify({
        token,
        new_password: newPassword,
      })); // Log the request body
      console.log("Request headers:", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }); // Log the request headers
      console.log("Token from URL:", tokenFromURL);

      if (res.ok) {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const data = await res.json();
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setMessage("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block mb-1">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter token from email"
            />
          </div>
          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
