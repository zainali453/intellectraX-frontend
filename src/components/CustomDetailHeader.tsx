import React from "react";
import CustomIcon from "./CustomIcon";
import { useNavigate } from "react-router-dom";

const CustomDetailHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center gap-4'>
      <button
        className='text-bgprimary hover:text-teal-600 cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <CustomIcon name='back' className='w-6 h-6' />
      </button>
      <h1 className='text-2xl font-medium text-textprimary'>{title}</h1>
    </div>
  );
};

export default CustomDetailHeader;
