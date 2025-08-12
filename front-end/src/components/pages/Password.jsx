import React, { useState } from "react";
import { toast } from "react-toastify";

function Password() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://rivoz.in/api/user/update-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
        }),
      });

      console.log("🔁 Sending password update request:", response);
      const data = await response.json();

      if (response.ok) {
        toast.success(`✅ ${data.message || "Password updated successfully!"}`);
      } else {
        toast.error(`❌ ${data?.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error updating password.");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Old Password</label>
          <input
            name="oldPassword"
            type="password"
            placeholder="Enter current password"
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold mt-2 w-full"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default Password;
