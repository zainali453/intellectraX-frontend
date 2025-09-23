import React from "react";
import { X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  cancelText?: string;
  deleteText?: string;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = "Once deleted this cannot be reverted.",
  itemName = "this class",
  cancelText = "Cancel",
  deleteText = "Delete",
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  // Generate title if not provided
  const modalTitle = title || `Are you sure you want to delete ${itemName}?`;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-[#0000002e] transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 text-center'>
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={loading}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <X className='w-6 h-6 text-red-500' />
        </button>

        {/* Delete Icon */}
        <div className='mb-6'>
          <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className='text-xl font-semibold text-gray-800 mb-4 leading-tight'>
          {modalTitle}
        </h2>

        {/* Message */}
        <p className='text-gray-600 mb-8 text-sm'>{message}</p>

        {/* Action Buttons */}
        <div className='flex gap-6 px-6'>
          <button
            onClick={handleCancel}
            disabled={loading}
            className='flex-1 bg-white text-gray-700 py-2 px-6 rounded-full font-medium text-base border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className='flex-1 bg-red-500 text-white py-2 px-6 rounded-full font-medium text-base hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              deleteText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
