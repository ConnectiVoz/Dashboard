import React, { useState } from "react";
import UserDetails from "../pages/POST/UserDetailsForm";
import AgentsList from "../pages/POST/AgentList";
import CallSheet from "../pages/POST/CallSHEET";
import CallLogsTable from "./CallLogsTable";

export default function PostLoginPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [callsCompleted, setCallsCompleted] = useState(0);

  const handleCallCompleted = () => setCallsCompleted((c) => c + 1);

  // Automatically select the default agent when AgentsList loads
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
  };

  // Pre-created campaign data
  const preCreatedCampaign = {
    campaign_id: 84,
    campaign_bot_id: "01K17PH3MZ7DGC2PXWW3SWVY82",
    campaign_name: "efgrtgerfre",
    campaign_status: "created",
    campaign_created_on: "2025-08-18T09:20:00.045050+00:00",
    campaign_scheduled_datetime: "2025-08-18T15:00:00+00:00",
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 bg-gray-50 text-gray-900 dark:bg-[#0b1020] dark:text-white">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Welcome — Complete Your Details & Start Calling
      </h1>

      {/* 1) User Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserDetails />
        </div>

        {/* 2) Agents (Bots) */}
        <div>
          <AgentsList onSelectAgent={handleAgentSelect} />
        </div>
      </div>

      {/* 3) Call flow */}
      <div className="mt-8">
        {callsCompleted >= 2 ? (
          <>
            <h2 className="text-xl font-bold mb-3">Call Details</h2>
            <CallLogsTable />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-3">Call Sheet</h2>
            <CallSheet
              selectedAgent={selectedAgent}
              preCreatedCampaignId={preCreatedCampaign.campaign_id}
              onCallCompleted={handleCallCompleted}
              callsCompleted={callsCompleted}
            />
          </>
        )}
      </div>
    </div>
  );
}
