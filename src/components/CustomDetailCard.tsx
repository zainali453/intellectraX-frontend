import React from "react";
import CustomIcon, { IconName } from "./CustomIcon";

interface CustomDetailCardProps {
  icon: IconName;
  label: string;
  value: string;
  className?: string;
}

const CustomDetailCard: React.FC<CustomDetailCardProps> = ({
  icon,
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg  drop-shadow-sm flex items-center gap-4 ${className}`}
    >
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-[#8E97A4] font-medium mb-1'>{label}</p>
        <p className='text-[#272B41] font-medium text-lg'>{value}</p>
      </div>
      <div className='flex-shrink-0'>
        <div className='w-14 h-14 bg-[#4393960D] rounded-full flex items-center justify-center'>
          <CustomIcon name={icon} size={28} />
        </div>
      </div>
    </div>
  );
};

export default CustomDetailCard;
