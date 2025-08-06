import React, { useState } from "react";

const CampaignTable = () => {
  const allCampaigns = [
    { name: "Ad Campaign 1", status: "Active", date: "2025-06-01" },
    { name: "Ad Campaign 2", status: "Paused", date: "2025-06-02" },
    { name: "Ad Campaign 3", status: "Completed", date: "2025-06-03" },
    { name: "Ad Campaign 4", status: "Active", date: "2025-06-04" },
    { name: "Ad Campaign 5", status: "Paused", date: "2025-06-05" },
    { name: "Ad Campaign 6", status: "Completed", date: "2025-06-06" },
    { name: "Ad Campaign 7", status: "Active", date: "2025-06-07" },
    { name: "Ad Campaign 8", status: "Completed", date: "2025-06-08" },
    { name: "Ad Campaign 9", status: "Paused", date: "2025-06-09" },
    { name: "Ad Campaign 10", status: "Active", date: "2025-06-10" },
  ];

  const [visible, setVisible] = useState(5);
  const [expanded, setExpanded] = useState(false);

  const toggleView = () => {
    if (expanded) {
      setVisible(5);
    } else {
      setVisible(allCampaigns.length);
    }
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-500 bg-green-100";
      case "Paused":
        return "text-yellow-500 bg-yellow-100";
      case "Completed":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-4xl mx-auto overflow-hidden">
      <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Campaign Table</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm uppercase text-gray-500 border-b">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {allCampaigns.slice(0, visible).map((campaign, idx) => (
              <tr
                key={idx}
                className={`text-sm transition duration-200 hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="py-3 px-3 font-medium text-black">{campaign.name}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-600">{campaign.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={toggleView}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-900 hover:to-black transition duration-300"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
};

export default CampaignTable;
