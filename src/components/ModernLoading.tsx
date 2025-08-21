import React from "react";

interface ModernLoadingProps {
  type?: "spinner" | "dots" | "pulse" | "bars" | "ripple";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray";
  text?: string;
  overlay?: boolean;
  className?: string;
}

const ModernLoading: React.FC<ModernLoadingProps> = ({
  type = "spinner",
  size = "md",
  color = "primary",
  text,
  overlay = false,
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return { container: "w-8 h-8", dot: "w-2 h-2", text: "text-sm" };
      case "md":
        return { container: "w-12 h-12", dot: "w-3 h-3", text: "text-base" };
      case "lg":
        return { container: "w-16 h-16", dot: "w-4 h-4", text: "text-lg" };
      case "xl":
        return { container: "w-24 h-24", dot: "w-6 h-6", text: "text-xl" };
      default:
        return { container: "w-12 h-12", dot: "w-3 h-3", text: "text-base" };
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return {
          border: "border-bgprimary",
          bg: "bg-bgprimary",
          text: "text-textprimary",
        };
      case "white":
        return {
          border: "border-white",
          bg: "bg-white",
          text: "text-white",
        };
      case "gray":
        return {
          border: "border-gray-400",
          bg: "bg-gray-400",
          text: "text-gray-600",
        };
      default:
        return {
          border: "border-bgprimary",
          bg: "bg-bgprimary",
          text: "text-textprimary",
        };
    }
  };

  const sizes = getSizeClasses();
  const colors = getColorClasses();

  const renderSpinner = () => (
    <div
      className={`${sizes.container} border-4 ${colors.border} border-t-transparent rounded-full animate-spin`}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes.dot} ${colors.bg} rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <div
        className={`${sizes.container} ${colors.bg} rounded-full animate-ping absolute`}
      />
      <div
        className={`${sizes.container} ${colors.bg} rounded-full animate-pulse`}
      />
    </div>
  );

  const renderBars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 ${colors.bg} rounded-full animate-pulse`}
          style={{
            height: `${12 + i * 4}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const renderRipple = () => (
    <div className="relative">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute ${sizes.container} border-2 ${colors.border} rounded-full animate-ping`}
          style={{
            animationDelay: `${i * 0.3}s`,
            animationDuration: "1.5s",
          }}
        />
      ))}
    </div>
  );

  const renderLoading = () => {
    switch (type) {
      case "spinner":
        return renderSpinner();
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "bars":
        return renderBars();
      case "ripple":
        return renderRipple();
      default:
        return renderSpinner();
    }
  };

  const loadingContent = (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {renderLoading()}
      {text && (
        <p className={`${sizes.text} font-medium ${colors.text} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
          {loadingContent}
        </div>
      </div>
    );
  }

  return loadingContent;
};

export default ModernLoading;
