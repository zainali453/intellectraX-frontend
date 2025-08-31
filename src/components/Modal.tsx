type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  status?: "success" | "error";
  showIcon?: boolean;
  onConfirm?: (() => void) | null;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "OK",
  status = "success", // 'success' or 'error'
  showIcon = true,
  onConfirm = null, // If provided, shows two buttons (Cancel and Confirm)
}: ModalProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const getStatusIcon = () => {
    if (!showIcon) return null;

    if (status === "success") {
      return (
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }
  };

  const getButtonColor = () => {
    if (status === "success") {
      return "bg-teal-600 hover:bg-teal-700";
    } else {
      return "bg-red-600 hover:bg-red-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 transform transition-all relative">
        {/* Close button in top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          {getStatusIcon()}

          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          {onConfirm ? (
            // Single full-width button for confirmation dialogs
            <button
              onClick={handleConfirm}
              className={`w-full ${getButtonColor()} text-white py-2 px-4 rounded-3xl font-medium transition-colors duration-200`}
            >
              {buttonText}
            </button>
          ) : (
            // Single button layout for info/success/error messages
            <button
              onClick={onClose}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-3xl font-medium transition-colors duration-200"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
