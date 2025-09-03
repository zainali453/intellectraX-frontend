import React from "react";

interface PricingPlanCardProps {
  title: string;
  credits: string;
  price: number;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  showSelectButton?: boolean;
}

const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  title,
  credits,
  price,
  isSelected = false,
  onSelect,
  showSelectButton = true,
  className = "",
}) => {
  return (
    <div
      className={`
        relative rounded-xl p-7 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-[#439396] border-2 bg-white shadow-md"
            : "border-gray-200 border bg-white hover:border-[#EAEAEA]"
        }
        ${className}
      `}
      onClick={onSelect}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-5 bg-[#439396] text-white px-17 py-[6px] rounded-b-full text-sm font-medium"></div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-textprimary text-base">{credits}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-semibold text-[#439396]">
            ${price}
          </span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>
      </div>

      {showSelectButton && (
        <button
          className={`
          w-full py-3 px-4 rounded-full font-medium transition-all duration-200
          ${
            isSelected
              ? "bg-[#439396] text-white hover:bg-[#439396]/90"
              : "border border-[#439396] text-[#439396] hover:bg-[#439396] hover:text-white"
          }
        `}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          Select Plan
        </button>
      )}
    </div>
  );
};

export default PricingPlanCard;
