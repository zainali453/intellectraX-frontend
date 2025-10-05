import React, { useState } from "react";
import CustomIcon, { IconName } from "./CustomIcon";

interface CustomDetailCardProps {
  icon: IconName;
  label: string;
  value: string;
  className?: string;
  onClick?: () => void;
  tooltip?: string;
  iconClassName?: string;
}

const CustomDetailCard: React.FC<CustomDetailCardProps> = ({
  icon,
  label,
  value,
  className = "",
  onClick,
  tooltip,
  iconClassName = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const shouldShowTooltip = onClick && tooltip;

  return (
    <div
      className={`bg-white p-4 rounded-lg drop-shadow-sm flex items-center gap-4 relative ${
        onClick
          ? "cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          : ""
      } ${className}`}
      onClick={onClick}
      onMouseEnter={() => shouldShowTooltip && setShowTooltip(true)}
      onMouseLeave={() => shouldShowTooltip && setShowTooltip(false)}
    >
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-[#8E97A4] font-medium mb-1'>{label}</p>
        <p className='text-[#272B41] font-medium text-lg'>{value}</p>
      </div>
      <div className='flex-shrink-0'>
        <div className='w-14 h-14 bg-[#4393960D] rounded-full flex items-center justify-center'>
          <CustomIcon
            name={icon}
            size={iconClassName ? undefined : 28}
            className={iconClassName}
          />
        </div>
      </div>

      {/* Tooltip */}
      {shouldShowTooltip && showTooltip && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10 shadow-lg'>
          {tooltip}
          {/* Arrow */}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
        </div>
      )}
    </div>
  );
};

export default CustomDetailCard;
