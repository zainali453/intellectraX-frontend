import PricingPlanCard from "../PricingPlanCard";
import { pricingPlans } from "../../utils/utils";

const PaymentDetails = ({ initialData }) => {
  const selectedPlan = pricingPlans.find(
    (plan) => plan.id === initialData.plan
  );

  if (!selectedPlan)
    return (
      <div className="my-20">
        <div className="font-medium text-gray-700 text-2xl text-center">
          No Plan Selected
        </div>
      </div>
    );

  return (
    <div className="my-4">
      <div className="font-medium text-gray-700 text-base mb-4">
        Selected Plan
      </div>
      <PricingPlanCard
        credits={selectedPlan.credits}
        price={selectedPlan.price}
        title={selectedPlan.title}
        isSelected={true}
        showSelectButton={false}
      />
    </div>
  );
};

export default PaymentDetails;
