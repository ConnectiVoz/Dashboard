import React, { useState } from "react";
import CallLogsTable from "./CallLogsTable";

const CallLogsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📞 Call Logs
        </h1>

        <CallLogsTable />
      </div>
    </div>
  );
};

export default CallLogsPage;
