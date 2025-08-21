import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  label?: React.ReactNode;
  name: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
  maxDate?: Date;
  minDate?: Date;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dateFormat?: string;
}

// Custom input component for the date picker
const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ error, ...props }, ref) => (
  <div className="relative">
    <input
      {...props}
      ref={ref}
      className={`
        w-full px-3 py-2 pr-10 
        border rounded-md 
        bg-white
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
        transition-all duration-200
        placeholder:text-[#8E97A4]
        ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400"
        }
        ${props.disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      readOnly
    />
    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <Calendar
        size={18}
        className={`${
          error ? "text-red-400" : "text-bgprimary"
        } transition-colors`}
      />
    </div>
  </div>
));

CustomInput.displayName = "CustomInput";

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  disabled = false,
  className = "",
  error,
  helpText,
  maxDate,
  minDate,
  showYearDropdown = true,
  showMonthDropdown = true,
  dateFormat = "MM/dd/yyyy",
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <ReactDatePicker
        id={name}
        name={name}
        selected={value}
        onChange={onChange}
        disabled={disabled}
        placeholderText={placeholder}
        dateFormat={dateFormat}
        maxDate={maxDate}
        minDate={minDate}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        dropdownMode="select"
        customInput={<CustomInput error={error} />}
        popperClassName="react-datepicker-popper"
        calendarClassName="react-datepicker-calendar"
      />

      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
};

export default DatePicker;
