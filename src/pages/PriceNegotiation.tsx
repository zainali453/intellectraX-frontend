import React, { useEffect } from "react";

import PriceNegotiation from "@/components/teacherOnboarding/PriceNegotation";
import {
  onboardingService,
  PriceNegotiationData,
} from "@/services/onboarding.service";
import LoadingSpinner from "@/components/LoadingSpinner";

const PriceNegotiationPage = () => {
  const [priceNegotiationData, setPriceNegotiationData] = React.useState<
    PriceNegotiationData[]
  >([]);
  const [isTeacherUpdate, setIsTeacherUpdate] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [update, setUpdate] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response =
          await onboardingService.getTeacherPriceNegotiationData();
        if (response.data) {
          setPriceNegotiationData(response.data.classes);
          setIsTeacherUpdate(response.data.updatedBy === "teacher");
        }
      } catch (error) {
        console.error("Error fetching price negotiation data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [update]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-120">
        <LoadingSpinner size={"lg"} />
      </div>
    );

  return (
    <PriceNegotiation
      setUpdate={setUpdate}
      isTeacherUpdate={isTeacherUpdate}
      negotiationData={priceNegotiationData}
      setNegotiationData={setPriceNegotiationData}
    />
  );
};

export default PriceNegotiationPage;
