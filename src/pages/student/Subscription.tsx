import React, { useState } from "react";
import { pricingPlans } from "../../utils/utils";

// Credit packages data
const creditPackages = [
  { id: "5credits", credits: 5, price: 15 },
  { id: "10credits", credits: 10, price: 25, bestValue: true },
  { id: "20credits", credits: 20, price: 45 },
];

// Dummy current subscription data
const currentSubscription = {
  planId: "standard",
  classesRemaining: 4,
  totalClasses: 10,
  renewalDate: "May 15, 2023",
  autoRenewal: true,
  price: 49,
  levelOfStudy: "HSSC",
};

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");

  // Filter plans for available plans (show 4 plans: basic, standard, premium, elite)
  const availablePlans = pricingPlans.filter((plan) =>
    ["basic", "standard", "premium", "elite"].includes(plan.id)
  );

  return (
    <div className='p-4'>
      <div className='bg-white rounded-2xl p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-[#272B41] text-xl font-semibold'>
            Current Subscription Plan
          </h1>
          <p className='text-[#272B41] text-xl'>
            Level of Study :{" "}
            <span className='font-semibold text-emerald-600'>
              {currentSubscription.levelOfStudy}
            </span>
          </p>
        </div>

        {/* Current Plan Card */}
        <div className='border border-gray-200 rounded-xl p-6 mb-6'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='bg-bgprimary text-white px-10 py-1 rounded-full text-base font-medium inline-block mb-4'>
                {pricingPlans.find(
                  (plan) => plan.id === currentSubscription.planId
                )?.title || "Standard Plan"}
              </div>
              <div className='space-y-2'>
                <p className='text-gray-600 text-base'>
                  Classes Remaining:{" "}
                  <span
                    className={`${
                      currentSubscription.classesRemaining < 5
                        ? currentSubscription.classesRemaining < 2
                          ? "text-red-600"
                          : "text-yellow-500"
                        : "text-bgprimary"
                    } font-medium`}
                  >
                    {currentSubscription.classesRemaining} out of{" "}
                    {currentSubscription.totalClasses}
                  </span>
                </p>
                <p className='text-gray-600 text-base'>
                  Renewal Date:{" "}
                  <span className='text-[#272B41] font-medium'>
                    {currentSubscription.renewalDate}
                  </span>
                </p>
                <p className='text-gray-600 text-base'>
                  Auto-Renewal:{" "}
                  <span className='text-bgprimary font-medium'>
                    {currentSubscription.autoRenewal ? "Enabled" : "Disabled"}
                  </span>
                </p>
              </div>
            </div>
            <div className='text-right'>
              <div className='mb-4'>
                <span className='text-3xl font-semibold text-bgprimary'>
                  ${currentSubscription.price}
                </span>
                <span className='text-gray-500 text-sm'>/month</span>
              </div>
              <div className='flex gap-3'>
                <button className='px-6 py-2 border border-bgprimary text-bgprimary rounded-full font-medium hover:bg-bgprimary hover:text-white transition-colors'>
                  Cancel Plan
                </button>
                <button className='px-6 py-2 bg-bgprimary text-white rounded-full font-medium hover:bg-[#357577] transition-colors'>
                  Renew Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans Section */}
        <h2 className='text-[#272B41] text-xl font-semibold mb-4'>
          Available Plans
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          {availablePlans.map((plan) => {
            const isCurrentPlan = plan.id === "standard";
            const isRecommended = plan.id === "standard";

            return (
              <div
                key={plan.id}
                className={`relative border rounded-xl p-5 ${
                  isCurrentPlan
                    ? "border-bgprimary border-2"
                    : "border-gray-200 hover:border-gray-300"
                } transition-all`}
              >
                {isRecommended && (
                  <div className='absolute -top-0 right-4 bg-bgprimary text-white px-3 py-1 rounded-b-lg text-xs font-medium'>
                    Recommended
                  </div>
                )}
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-[#272B41] font-semibold'>
                      {plan.title}
                    </h3>
                    <p className='text-gray-500 text-sm'>
                      {plan.credits === "Unlimited Credits"
                        ? "Unlimited Classes"
                        : `${plan.credits.replace(" Credits", "")} Classes`}
                    </p>
                  </div>
                  <div className='text-right'>
                    <span className='text-2xl font-semibold text-bgprimary'>
                      ${plan.price}
                    </span>
                    <span className='text-gray-500 text-sm'>/month</span>
                  </div>
                </div>
                <button
                  className={`w-full py-2.5 rounded-full font-medium transition-colors ${
                    isCurrentPlan
                      ? "bg-bgprimary text-white"
                      : "border border-bgprimary text-bgprimary hover:bg-bgprimary hover:text-white"
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Credit Packages Section */}
        <h2 className='text-[#272B41] text-xl font-semibold mb-4'>
          Select a credit package to add to your account
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className='border border-gray-200 rounded-xl p-5 text-center hover:border-gray-300 transition-all'
            >
              <div className='h-6 mb-2'>
                {pkg.bestValue && (
                  <div className='inline-block bg-bgprimary text-white px-3 py-1 rounded-full text-xs font-medium'>
                    Best Value
                  </div>
                )}
              </div>
              <h3 className='text-bgprimary text-xl font-semibold mb-1'>
                {pkg.credits} Credits
              </h3>
              <p className='text-gray-600 font-medium mb-4'>${pkg.price}</p>
              <button className='w-full py-2.5 bg-bgprimary text-white rounded-full font-medium hover:bg-[#357577] transition-colors'>
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
