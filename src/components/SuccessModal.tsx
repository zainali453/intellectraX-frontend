import React from "react";
import { X } from "lucide-react";
import CustomIcon from "./CustomIcon";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Successfully Updated!",
  message,
  buttonText = "Okay",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-[#0000002e] transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 text-center'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X className='w-6 h-6 text-red-500' />
        </button>

        {/* Success Icon */}
        <div className='mb-6'>
          <div className='flex items-center justify-center'>
            <CustomIcon name='success' size={80} />
          </div>
        </div>

        {/* Title */}
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>{title}</h2>

        {/* Optional Message */}
        {message && <p className='text-gray-600 mb-6 text-sm'>{message}</p>}

        {/* Okay Button */}
        <button
          onClick={onClose}
          className='bg-bgprimary text-white py-2 px-8 rounded-full font-medium text-base hover:bg-teal-600 transition-colors duration-200'
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
