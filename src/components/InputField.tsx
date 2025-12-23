import React, { useRef } from "react";
import CustomIcon, { IconName } from "./CustomIcon";

type BaseProps = {
  label?: React.ReactNode;
  name: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string; // wrapper class
  inputClassName?: string; // additional input styles
  helpText?: string;
  error?: string;
};

type InputOnlyProps = BaseProps & {
  type?: Exclude<React.HTMLInputTypeAttribute, "date">; // Exclude date type to encourage using DatePicker
  as?: "input";
};

type TextAreaProps = BaseProps & {
  as: "textarea";
  rows?: number;
};

type EndIconProps =
  | {
      endIconName?: IconName; // show CustomIcon by name
      endIconSize?: number | string;
      endIconTitle?: string;
      onEndIconClick?: () => void;
      endIcon?: never;
    }
  | {
      endIcon?: React.ReactNode; // custom react node
      onEndIconClick?: () => void;
      endIconName?: never;
      endIconSize?: never;
      endIconTitle?: never;
    }
  | {};

export type InputFieldProps = (InputOnlyProps | TextAreaProps) & EndIconProps;

const baseInputClasses =
  "w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200";

export default function InputField(props: InputFieldProps) {
  const {
    label,
    name,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    autoComplete,
    className,
    inputClassName,
    helpText,
    error,
  } = props;

  const isTextArea = (props as TextAreaProps).as === "textarea";
  const inputType = !isTextArea
    ? (props as InputOnlyProps).type ?? "text"
    : undefined;
  const hasEndAdornment = Boolean(
    (props as any).endIcon || (props as any).endIconName
  );

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const inputPaddingRight = hasEndAdornment ? "pr-10" : "";

  // Determine border color based on error state
  const borderColor = error
    ? "border-red-300 focus:ring-red-500"
    : "border-gray-300 hover:border-gray-400";

  // Determine background color based on disabled state
  const bgColor = disabled ? "bg-gray-50" : "bg-white";

  const commonProps = {
    name,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    autoComplete,
    className: [
      baseInputClasses,
      inputPaddingRight,
      borderColor,
      bgColor,
      "placeholder:text-[#8E97A4]",
      disabled ? "cursor-not-allowed text-gray-500" : "",
      inputClassName,
    ]
      .filter(Boolean)
      .join(" "),
    ref: inputRef as any,
  } as const;

  const inputEl = (() => {
    if (isTextArea) {
      const { rows = 3 } = props as TextAreaProps;
      return (
        <textarea {...commonProps} rows={rows} style={{ resize: "none" }} />
      );
    }
    return <input {...commonProps} type={inputType} />;
  })();

  const handleAdornmentClick = () => {
    const userHandler = (props as any).onEndIconClick as
      | (() => void)
      | undefined;
    if (userHandler) {
      userHandler();
      return;
    }
    // Focus the input when icon is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderEndAdornment = () => {
    if (!hasEndAdornment) return null;
    const clickable = Boolean((props as any).onEndIconClick);

    if ((props as any).endIcon) {
      return (
        <div
          className={
            "absolute inset-y-0 right-2 flex items-center transition-colors " +
            (clickable
              ? "cursor-pointer hover:text-teal-600"
              : "pointer-events-none")
          }
          onClick={clickable ? handleAdornmentClick : undefined}
        >
          {(props as any).endIcon}
        </div>
      );
    }
    if ((props as any).endIconName) {
      const { endIconName, endIconSize = 20, endIconTitle } = props as any;
      return (
        <div
          className={
            "absolute inset-y-0 right-2 flex items-center transition-colors " +
            (clickable
              ? "cursor-pointer hover:opacity-70"
              : "pointer-events-none")
          }
          title={endIconTitle}
          onClick={clickable ? handleAdornmentClick : undefined}
        >
          <CustomIcon name={endIconName} size={endIconSize} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className='block text-sm font-medium text-[#6b727d] mb-2'
        >
          {label}
          {required && <span className='text-red-600 ml-1'>*</span>}
        </label>
      )}
      <div className='relative mb-2'>
        {inputEl}
        {renderEndAdornment()}
      </div>
      {error ? (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
      ) : helpText ? (
        <p className='mt-1 text-sm text-gray-500'>{helpText}</p>
      ) : null}
    </div>
  );
}
