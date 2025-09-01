import React, { useEffect } from "react";

import PriceNegotiation from "@/components/teacherOnboarding/PriceNegotation";
import {
  onboardingService,
  PriceNegotiationData,
} from "@/services/onboarding.service";

const PriceNegotiationPage = () => {
  const [priceNegotiationData, setPriceNegotiationData] = React.useState<
    PriceNegotiationData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await onboardingService.getTeacherPriceNegotiationData();
        if (response.data) setPriceNegotiationData(response.data.classes);
      } catch (error) {
        console.error("Error fetching price negotiation data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <PriceNegotiation
      negotiationData={priceNegotiationData}
      setNegotiationData={setPriceNegotiationData}
    />
  );
};

export default PriceNegotiationPage;
