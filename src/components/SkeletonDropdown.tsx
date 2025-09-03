import React from "react";

interface SkeletonDropdownProps {
  label?: string;
  required?: boolean;
  className?: string;
}

const SkeletonDropdown: React.FC<SkeletonDropdownProps> = ({
  label,
  required = false,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      <div className="relative">
        <div className="w-full px-4 py-[14px] bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="h-4 bg-gray-300 rounded animate-pulse"
                style={{ width: "120px" }}
              ></div>
            </div>
            <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDropdown;
