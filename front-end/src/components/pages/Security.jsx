import React, { useState } from "react";
import { toast } from "react-toastify"; // ✅ Make sure toast is imported

function Security() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [reminderInterval, setReminderInterval] = useState("7");

  const handleEnable2FA = async (e) => {
    e.preventDefault();

    if (pin.length !== 6 || isNaN(pin)) {
      toast.error("Enter a valid 6-digit PIN.");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("PINs do not match.");
      return;
    }

    try {
      const response = await fetch("https://rivoz.in/api/user/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          two_factor_pin: pin,
          two_factor_reminder_days: reminderInterval,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("✅ 2FA Enabled Successfully!");
      } else {
        toast.error(`❌ Failed: ${data?.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error enabling 2FA.");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-50 p-6 rounded-2xl shadow-md border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Two-Factor Authentication</h2>

      <form className="space-y-4" onSubmit={handleEnable2FA}>
        <input
          type="password"
          placeholder="Enter 6-digit PIN"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-2 mt-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Confirm PIN"
          maxLength={6}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          className="w-full p-2 mt-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400"
        />

        <label className="block mt-4 mb-1 font-semibold">Reminder Interval</label>
        <select
          value={reminderInterval}
          onChange={(e) => setReminderInterval(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
        >
          <option value="7">Ask every 7 days</option>
          <option value="15">Ask every 15 days</option>
          <option value="30">Ask every 30 days</option>
          <option value="0">Ask every time</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold mt-4 w-full"
        >
          Enable 2FA
        </button>
      </form>
    </div>
  );
}

export default Security;
