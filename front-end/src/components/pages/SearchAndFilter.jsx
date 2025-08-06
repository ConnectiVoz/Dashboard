import React from "react";
import { FaSearch, FaDownload, FaFilter } from "react-icons/fa";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onDownloadCSV,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-5 w-full">
      <div className="flex items-center flex-wrap gap-4 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search by Phone, Campaign or Agent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pr-8 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">All</option>
            <option value="Ring">Ring</option>
            <option value="Failed">Failed</option>
            <option value="Connected">Connected</option>
          </select>
          <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Download CSV */}
      {/* <button
        onClick={onDownloadCSV}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-all duration-300"
      >
        <FaDownload /> Download CSV
      </button> */}
    </div>
  );
};

export default SearchAndFilter;
