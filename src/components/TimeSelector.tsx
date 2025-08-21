import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  format24?: boolean; // Use 24-hour format or 12-hour format
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  value = "",
  onChange,
  placeholder = "Select time",
  required = false,
  error,
  disabled = false,
  className = "",
  format24 = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value ? parseInt(value.split(":")[0]) : 9
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? parseInt(value.split(":")[1]) : 0
  );
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    !format24 && value
      ? parseInt(value.split(":")[0]) >= 12
        ? "PM"
        : "AM"
      : "AM"
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate hours array based on format
  const hours = format24
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minutes array (every 15 minutes)
  const minutes = Array.from({ length: 4 }, (_, i) => i * 15);

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

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":").map(Number);
      setSelectedHour(
        format24 ? hour : hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      );
      setSelectedMinute(minute);
      if (!format24) {
        setSelectedPeriod(hour >= 12 ? "PM" : "AM");
      }
    }
  }, [value, format24]);

  const formatDisplayTime = () => {
    if (!value) return placeholder;

    const [hour, minute] = value.split(":").map(Number);

    if (format24) {
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    } else {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "period",
    newValue: number | string
  ) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let newPeriod = selectedPeriod;

    if (type === "hour") {
      newHour = newValue as number;
      setSelectedHour(newHour);
    } else if (type === "minute") {
      newMinute = newValue as number;
      setSelectedMinute(newMinute);
    } else if (type === "period") {
      newPeriod = newValue as "AM" | "PM";
      setSelectedPeriod(newPeriod);
    }

    // Convert to 24-hour format for the value
    let hour24 = newHour;
    if (!format24) {
      if (newPeriod === "PM" && newHour !== 12) {
        hour24 = newHour + 12;
      } else if (newPeriod === "AM" && newHour === 12) {
        hour24 = 0;
      }
    }

    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinute
      .toString()
      .padStart(2, "0")}`;
    onChange?.(timeString);
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
            w-full px-3 py-2 pr-10 text-left bg-white border rounded-md
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
            transition-all duration-200
            placeholder:text-[#8E97A4]
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
          `}
        >
          <span className={value ? "text-gray-900" : "text-[#8E97A4]"}>
            {formatDisplayTime()}
          </span>
        </button>
        {!isOpen && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <Clock
              size={18}
              className={`${
                error ? "text-red-400" : "text-bgprimary"
              } transition-colors`}
            />
          </div>
        )}
        {/* Time Picker Dropdown */}
        {isOpen && (
          <div className="z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-4">
              <div
                className={`flex gap-4 ${
                  !format24 ? "justify-between" : "justify-center"
                }`}
              >
                {/* Hours */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-2 text-center">
                    Hours
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleTimeChange("hour", hour)}
                        className={`
                          w-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors
                          ${
                            selectedHour === hour
                              ? "bg-teal-500 text-white hover:bg-teal-600"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {format24 ? hour.toString().padStart(2, "0") : hour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-2 text-center">
                    Minutes
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => handleTimeChange("minute", minute)}
                        className={`
                          w-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors
                          ${
                            selectedMinute === minute
                              ? "bg-teal-500 text-white hover:bg-teal-600"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM for 12-hour format */}
                {!format24 && (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-2 text-center">
                      Period
                    </label>
                    <div className="border rounded">
                      {["AM", "PM"].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => handleTimeChange("period", period)}
                          className={`
                            w-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors
                            ${
                              selectedPeriod === period
                                ? "bg-teal-500 text-white hover:bg-teal-600"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TimeSelector;
