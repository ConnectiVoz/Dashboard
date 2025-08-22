import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CallSheet({ selectedAgent, preCreatedCampaignId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentCampaignId, setCurrentCampaignId] = useState(preCreatedCampaignId || null);

  useEffect(() => {
    // Update currentCampaignId if agent changes
    if (preCreatedCampaignId) setCurrentCampaignId(preCreatedCampaignId);
  }, [preCreatedCampaignId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.title || !formData.phone) {
      toast.error("All fields are required");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (!selectedAgent) {
      toast.info("Agent not selected");
      return false;
    }
    return true;
  };

  const handleRunCampaign = async () => {
    if (!validateForm()) return;
    if (!currentCampaignId) {
      toast.error("No pre-created campaign found for this agent!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://rivoz.in/api/campaigns/run-campaign/${currentCampaignId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            title: formData.title,
            phone: formData.phone,
          }),
        }
      );
      console.log(res)
     if(res.ok)
     {
      console.log(res)
     }
      if (!res.ok) throw new Error("Failed to start campaign");
      toast.success("✅ Campaign started successfully!");
      setRunning(true);

      // Optional: reset form
      setFormData({ firstName: "", lastName: "", title: "", phone: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error running campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleStopCampaign = async () => {
    if (!currentCampaignId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://rivoz.in/api/campaigns/stop-campaign/${currentCampaignId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to stop campaign");
      toast.success("✅ Campaign stopped!");
      setRunning(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error stopping campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Call Agent</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded focus:ring focus:ring-indigo-400 outline-none"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded focus:ring focus:ring-indigo-400 outline-none"
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded focus:ring focus:ring-indigo-400 outline-none"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded focus:ring focus:ring-indigo-400 outline-none"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={running ? handleStopCampaign : handleRunCampaign}
          disabled={loading}
          className={`w-full md:w-1/3 py-3 font-semibold rounded-xl shadow-md transition transform 
            ${running ? "bg-red-500 hover:bg-red-600 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Processing..." : running ? "Stop Campaign" : "Run Campaign"}
        </button>
      </div>
    </div>
  );
}
