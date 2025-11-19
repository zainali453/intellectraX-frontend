import { FC } from "react";

interface ScreenShareIconProps {
  className?: string;
  strokeWidth?: number;
}

const ScreenShareIcon: FC<ScreenShareIconProps> = ({
  className = "",
  strokeWidth = 2,
}) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={strokeWidth}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='3' y='4' width='18' height='12' rx='2' />
    <path d='M8 20h8' />
    <path d='m10 16 2-2 2 2' />
    <path d='M12 14v6' />
  </svg>
);

export default ScreenShareIcon;
