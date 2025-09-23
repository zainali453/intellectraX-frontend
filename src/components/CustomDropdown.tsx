import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  isAbsolute?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder = "Please select...",
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
  className = "",
  isAbsolute = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <div className='relative'>
        <button
          type='button'
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left border rounded-lg
            transition-all duration-200 flex items-center justify-between
            ${
              error
                ? "border-red-300 focus:ring-red-500"
                : disabled
                ? "border-gray-200"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed text-gray-400 shadow-none opacity-75 select-none"
                : "bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent"
            }
            ${
              isOpen && !disabled
                ? "ring-2 ring-bgprimary border-transparent"
                : ""
            }
          `}
        >
          <span
            className={`${
              disabled
                ? "text-gray-400"
                : selectedOption
                ? "text-gray-900"
                : "text-gray-500"
            }`}
          >
            {disabled && (
              <span className='inline-flex items-center mr-2'>
                <svg
                  className='w-4 h-4 text-gray-300'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              disabled ? "text-gray-300" : "text-gray-400"
            } ${isOpen && !disabled ? "transform rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={` ${
              isAbsolute ? "absolute" : ""
            } top-12 z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  !option.disabled && handleOptionSelect(option.value)
                }
                className={`
                  px-4 py-3 cursor-pointer transition-colors duration-150
                  ${
                    option.disabled
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "text-gray-900"
                  }
                  ${
                    value === option.value
                      ? "bg-bgprimary text-white hover:bg-teal-600 "
                      : " hover:bg-gray-100"
                  }
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default CustomDropdown;
