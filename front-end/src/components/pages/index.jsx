import React, { useState } from 'react';
import Header from './Header';
import CallLogsTable from './CallLogsTable';
import ClickToCallPanel from './ClickToCallPanel';
import { callLogsData } from '../Components/Data/MockData';
import SearchAndFilter from './SearchAndFilter';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCalls, setSelectedCalls] = useState([]); // JavaScript-compatible

  //Safe filtering even if callLogsData is undefined
  const filteredData = (callLogsData || []).filter((call) => {
    const matchesSearch =
      call.phoneNumber.includes(searchTerm) ||
      call.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.agentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || call.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Call Logs</h1>

              <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>

            <CallLogsTable
              data={filteredData}
              selectedCalls={selectedCalls}
              setSelectedCalls={setSelectedCalls}
            />
          </div>
        </div>

        <div className="w-80">
          <ClickToCallPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
