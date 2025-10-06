interface ConfirmClassEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  availableCredits: number;
  classDetails: {
    subject: string;
    teacher: string;
    date: string;
    time: string;
  };
  loading?: boolean;
}

const ConfirmClassEnrollmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  availableCredits,
  classDetails,
  loading = false,
}: ConfirmClassEnrollmentModalProps) => {
  if (!isOpen) return null;

  const creditsAfterEnrollment = availableCredits - 1;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl max-w-lg w-full mx-4 transform transition-all relative'>
        <div className='flex justify-between items-center mb-4 border-b-2 pb-4 border-[#F2F2F2]'>
          <h2 className='text-2xl font-semibold text-[#272B41] pl-4 pt-6'>
            Confirm Class Enrollment
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className='text-gray-400 pr-4 pt-6 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <div className='text-left p-6'>
          {/* Available Credits */}
          <div className='flex justify-between items-center mb-6 bg-bgprimary/7 p-4 rounded-lg'>
            <span className='text-[#565656] text-base'>Available Credits</span>
            <div>
              <span className='text-bgprimary font-semibold text-xl'>
                {availableCredits}{" "}
              </span>
              <span className=' font-medium text-xl'>credits</span>
            </div>
          </div>

          {/* Credit Deduction Info */}
          <div className='mb-8 text-textprimary leading-relaxed'>
            {creditsAfterEnrollment >= 0 ? (
              <p>
                Accepting this class will deduct{" "}
                <span className='font-bold text-gray-700'>1 credit</span> from
                your available credits. After confirmation, you will have{" "}
                <span className='font-bold text-gray-700'>
                  {creditsAfterEnrollment} credits
                </span>{" "}
                remaining.
              </p>
            ) : (
              <p>
                You do not have enough credits to enroll in this class. Please
                top up your credits to proceed.
              </p>
            )}
          </div>

          {/* Class Details */}
          <div className='space-y-3 mb-8 bg-bgprimary/7 p-4 rounded-lg'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Subject:</span>
              <span className='text-gray-900 font-medium'>
                {classDetails.subject}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Teacher:</span>
              <span className='text-gray-900 font-medium'>
                {classDetails.teacher}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Date:</span>
              <span className='text-gray-900 font-medium'>
                {classDetails.date}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Time:</span>
              <span className='text-gray-900 font-medium'>
                {classDetails.time}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <button
              onClick={onClose}
              disabled={loading}
              className='flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-full font-medium text-base transition-colors duration-200 disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || availableCredits < 1}
              className='flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-full font-medium text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                  Processing...
                </span>
              ) : (
                "Confirm Enrollment"
              )}
            </button>
          </div>

          {/* Warning for insufficient credits */}
          {availableCredits < 1 && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>
                You don't have enough credits to enroll in this class.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmClassEnrollmentModal;
