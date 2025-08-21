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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left bg-white border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent
            transition-all duration-200 flex items-center justify-between
            ${
              error
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              disabled
                ? "bg-gray-50 cursor-not-allowed text-gray-500"
                : "cursor-pointer"
            }
            ${isOpen ? "ring-2 ring-bgprimary border-transparent" : ""}
          `}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 text-gray-400 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                      : "text-gray-900 hover:bg-gray-50"
                  }
                  ${
                    value === option.value
                      ? "bg-bgprimary text-white hover:bg-bgprimary"
                      : ""
                  }
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomDropdown;
