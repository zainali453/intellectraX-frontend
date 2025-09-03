import React, { useState } from "react";
import CustomDropdown from "../CustomDropdown";
import PricingPlanCard from "../PricingPlanCard";
import { pricingPlans } from "../../utils/utils";

const LevelOfStudy = ({ initialData, onChange }) => {
  const [studyLevel, setStudyLevel] = useState<string>(initialData.level || "");
  const [selectedPlan, setSelectedPlan] = useState<string>(
    initialData.plan || ""
  );

  const ukEducationLevels = [
    { value: "11-plus", label: "11 Plus" },
    { value: "ks3", label: "Key Stage 3" },
    { value: "gcse", label: "GCSE" },
    { value: "a-level", label: "A-Level" },
  ];

  const handleLevelChange = (level: string) => {
    setStudyLevel(level);
    onChange({ ...initialData, level });
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onChange({ ...initialData, plan: planId });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 p-1">
        <CustomDropdown
          label="Level of Study"
          placeholder="Select level of study"
          value={studyLevel}
          onChange={(value) => handleLevelChange(value)}
          options={ukEducationLevels}
          required
        />
      </div>

      {/* Credit Info Banner */}
      <div className="bg-[#F1F9F9] rounded-lg p-2 mb-8 text-center">
        <p className="text-bgprimary font-medium text-lg">1 credit = 1 hour</p>
      </div>

      {/* Available Plans Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pricingPlans.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              title={plan.title}
              credits={plan.credits}
              price={plan.price}
              isSelected={selectedPlan === plan.id}
              onSelect={() => handlePlanSelect(plan.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelOfStudy;
