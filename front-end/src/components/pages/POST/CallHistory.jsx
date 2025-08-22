import React, { useState } from "react";
import UserDetailsForm from "../POST/UserDetailsForm"
import AgentsList from "../POST/AgentList";
import CallSheet from "../POST/CallSHEET";
import CallLogsTable from "../CallLogsTable"

export default function PostLoginPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [callsCompleted, setCallsCompleted] = useState(0);
  const [showCallLogs, setShowCallLogs] = useState(false);

  const handleCallCompleted = () => setCallsCompleted((c) => c + 1);

  const handleAgentSelect = (agent) => setSelectedAgent(agent);

  // Callback after campaign run/stop to show call logs
  const handleCampaignUpdate = () => {
    setShowCallLogs(true);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 bg-gray-50 dark:bg-[#0b1020] text-gray-900 dark:text-white">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Welcome — Complete Your Details & Start Calling
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserDetailsForm />
        </div>

        <div>
          <AgentsList onSelectAgent={handleAgentSelect} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">Call Sheet</h2>
        <CallSheet
          selectedAgent={selectedAgent}
          preCreatedCampaignId={84}
          onCallCompleted={handleCallCompleted}
          onCampaignUpdate={handleCampaignUpdate} // refresh logs & show table
        />

        {showCallLogs && (
          <>
            <h2 className="text-xl font-bold mt-8 mb-3">Call History</h2>
            <CallLogsTable />
          </>
        )}
      </div>
    </div>
  );
}
