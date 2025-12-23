import React from "react";

type ParentSubscriptionCardProps = {
  name: string;
  initials?: string;
  planLabel: string;
  price: number;
  currencySymbol?: string;
  per?: string; // e.g. "/month"
  classesRemaining: number;
  classesTotal: number;
  renewalDate: string; // formatted date string
  autoRenewalEnabled: boolean;
};

const ParentSubscriptionCard: React.FC<ParentSubscriptionCardProps> = ({
  name,
  initials,
  planLabel,
  price,
  currencySymbol = "$",
  per = "/month",
  classesRemaining,
  classesTotal,
  renewalDate,
  autoRenewalEnabled,
}) => {
  const displayInitials =
    initials ||
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");

  return (
    <div className='border border-gray-200 rounded-2xl p-6'>
      <div className='flex items-center gap-4'>
        <div className='w-16 h-16 rounded-full text-2xl text-bgprimary bg-gray-100 flex items-center justify-center font-semibold'>
          {displayInitials}
        </div>

        <div className='flex-1'>
          <div className='text-2xl font-semibold text-gray-800'>{name}</div>

          <div className='mt-2 flex items-center gap-3'>
            <span className='inline-flex items-center rounded-full bg-teal-100 text-teal-700 text-sm px-3 py-1'>
              {planLabel}
            </span>
            <span className='text-3xl font-semibold text-teal-600'>
              {currencySymbol}
              {price}
            </span>
            <span className='text-gray-500 text-lg'>{per}</span>
          </div>

          <div className='mt-4 space-y-2 text-medium'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-700'>Classes Remaining:</span>
              <span className='text-red-600'>
                {classesRemaining} out of {classesTotal}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-gray-700'>Renewal Date:</span>
              <span className='text-gray-800'>{renewalDate}</span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-gray-700'>Auto-Renewal:</span>
              <span
                className={
                  autoRenewalEnabled ? "text-teal-600" : "text-gray-600"
                }
              >
                {autoRenewalEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSubscriptionCard;
