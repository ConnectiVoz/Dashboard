import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/fetchWithAuth";
import { toast } from "react-toastify";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const res = await fetchWithAuth("https://rivoz.in/api/user/user-profile/");
      const data = await res.json();
      if (res.ok) setUser(data);
      else toast.error(data.message || "Failed to fetch user details");
    } catch (err) {
      toast.error("Something went wrong while fetching user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-400">No user data available</p>;
  }

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 hover:shadow-xl transition-all duration-500 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">User Information</h2>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">First Name:</span>
          <span>{user.first_name || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Last Name:</span>
          <span>{user.last_name || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Email:</span>
          <span>{user.email || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Phone:</span>
          <span>{user.phone || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Company Name:</span>
          <span>{user.company_name || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Address:</span>
          <span>{user.address || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">City:</span>
          <span>{user.city || "—"}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <span className="font-semibold text-gray-300">State:</span>
          <span>{user.state || "—"}</span>
        </div>
      </div>
    </div>
  );
}
