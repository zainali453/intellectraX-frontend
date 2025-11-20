import React from "react";

interface ConfirmRemoveChildModalProps {
  isOpen: boolean;
  childName: string;
  childEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmRemoveChildModal: React.FC<ConfirmRemoveChildModalProps> = ({
  isOpen,
  childName,
  childEmail,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn'>
        {/* Warning Icon */}
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className='text-2xl font-bold text-center text-gray-900 mb-2'>
          Remove Child?
        </h3>

        {/* Warning Message */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
          <p className='text-sm text-yellow-800 font-medium mb-2'>
            ⚠️ This action cannot be reversed!
          </p>
          <p className='text-xs text-yellow-700'>
            Once removed, {childName} will need to re-add your email address to
            reconnect their account with your parent portal.
          </p>
        </div>

        {/* Child Details */}
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <p className='text-sm text-gray-600 mb-1'>Child's Name:</p>
          <p className='text-base font-semibold text-gray-900 mb-3'>
            {childName}
          </p>
          <p className='text-sm text-gray-600 mb-1'>Email:</p>
          <p className='text-base font-medium text-gray-700'>{childEmail}</p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            className='flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 py-3 px-4 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors'
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveChildModal;
