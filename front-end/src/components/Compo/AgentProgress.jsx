import React, { useState } from "react";
import Progress from "./Progress";

const AgentProgress = ({ agents = [] }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    setVisibleCount(expanded ? 3 : agents.length);
  };

  return (
    <div className="w-full h-full max-w-full bg-white rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Agent Performance</h2>

      <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {agents.slice(0, visibleCount).map((agent, index) => (
          <Progress key={index} label={agent.name} percentage={agent.progress} />
        ))}
      </div>

      {agents.length > 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleToggle}
            className="text-sm font-medium px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition duration-300"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentProgress;
