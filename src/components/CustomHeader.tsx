import React from "react";

interface CustomHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  placeholder?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  searchValue,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold text-textprimary">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-bgprimary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white">
          <svg
            className="h-5 w-5 text-bgprimary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-bgprimary font-medium cursor-pointer">
            Select Date Range
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
