import React from "react";

interface CustomHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  searchValue,
  onSearchChange,
  placeholder = "Search...",
}) => {
  return (
    <div className='flex justify-between items-center mb-4'>
      <h1 className='text-3xl font-semibold text-textprimary'>{title}</h1>

      {
        <div className='flex items-center gap-4'>
          {/* Search Input */}
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-bgprimary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className='block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-bgprimary focus:border-bgprimary sm:text-sm'
            />
          </div>
        </div>
      }
    </div>
  );
};

export default CustomHeader;
