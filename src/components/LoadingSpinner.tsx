import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray";
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  text,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const colorClasses = {
    primary: "border-bgprimary border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-300 border-t-transparent",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Modern spinning dots */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            size === "sm"
              ? "w-2 h-2"
              : size === "md"
              ? "w-3 h-3"
              : size === "lg"
              ? "w-4 h-4"
              : "w-6 h-6"
          } bg-bgprimary rounded-full animate-pulse`}
        />
      </div>

      {text && (
        <p
          className={`${textSizeClasses[size]} font-medium ${
            color === "white" ? "text-white" : "text-textprimary"
          } animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">{spinner}</div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
