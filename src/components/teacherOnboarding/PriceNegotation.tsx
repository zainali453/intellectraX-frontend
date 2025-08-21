import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Check, X } from "lucide-react";

interface PriceNegotiationItem {
  subject: string;
  yourPrice: number;
  adminOffer: number;
  response: "accept" | "reject" | null;
}

interface PriceNegotiationData {
  level: string;
  items: PriceNegotiationItem[];
  adminNote?: string;
}

type PriceNegotiationProps = {
  initialData?: PriceNegotiationData;
  onChange?: (data: PriceNegotiationData) => void;
  onProposeNewPricing?: (data: PriceNegotiationData) => void;
  onAcceptOffer?: (data: PriceNegotiationData) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentStep?: number;
  totalSteps?: number;
};

const PriceNegotiation = forwardRef<any, PriceNegotiationProps>(
  (
    {
      initialData,
      onChange,
      onProposeNewPricing,
      onAcceptOffer,
      onNext,
      onPrevious,
      currentStep = 1,
      totalSteps = 4,
    },
    ref
  ) => {
    const [negotiationData, setNegotiationData] =
      useState<PriceNegotiationData>(
        initialData || {
          level: "GCSE",
          items: [
            {
              subject: "Mathematics",
              yourPrice: 30.0,
              adminOffer: 28.0,
              response: null,
            },
            {
              subject: "Biology",
              yourPrice: 27.0,
              adminOffer: 25.0,
              response: null,
            },
            {
              subject: "English",
              yourPrice: 30.0,
              adminOffer: 28.0,
              response: null,
            },
            {
              subject: "Physics",
              yourPrice: 30.0,
              adminOffer: 28.0,
              response: null,
            },
            {
              subject: "Chemistry",
              yourPrice: 30.0,
              adminOffer: 28.0,
              response: null,
            },
          ],
          adminNote: "We've adjusted prices to match our current market rates.",
        }
      );

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Expose methods to parent component through ref
    useImperativeHandle(ref, () => ({
      getData: async () => {
        return negotiationData;
      },
    }));

    const handleResponseChange = (
      index: number,
      response: "accept" | "reject" | null
    ) => {
      const newData = {
        ...negotiationData,
        items: negotiationData.items.map((item, i) =>
          i === index ? { ...item, response } : item
        ),
      };
      setNegotiationData(newData);
      onChange?.(newData);
    };

    const handlePriceChange = (index: number, newPrice: number) => {
      const newData = {
        ...negotiationData,
        items: negotiationData.items.map((item, i) =>
          i === index ? { ...item, yourPrice: newPrice } : item
        ),
      };
      setNegotiationData(newData);
      setHasUnsavedChanges(true);
      onChange?.(newData);
    };

    const handleProposeNewPricing = () => {
      // Validate that all prices are greater than 0
      const validPrices = negotiationData.items.every(
        (item) => item.yourPrice > 0
      );

      if (!validPrices) {
        alert("Please ensure all prices are greater than £0.00");
        return;
      }

      // Send updated pricing data to admin
      onProposeNewPricing?.(negotiationData);
      setHasUnsavedChanges(false);
      console.log("Proposing new pricing to admin:", negotiationData);

      // You can add success feedback here
      alert("New pricing proposal has been sent to admin for review!");
    };

    const handleAcceptOffer = () => {
      // Accept all offers
      const newData = {
        ...negotiationData,
        items: negotiationData.items.map((item) => ({
          ...item,
          response: "accept" as const,
        })),
      };
      setNegotiationData(newData);
      onChange?.(newData);
      onAcceptOffer?.(newData);
    };

    const allResponsesGiven = negotiationData.items.every(
      (item) => item.response !== null
    );
    const hasAcceptedItems = negotiationData.items.some(
      (item) => item.response === "accept"
    );
    const hasValidPrices = negotiationData.items.every(
      (item) => item.yourPrice > 0
    );

    return (
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl my-10">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-textprimary mb-2">
            Class & Subjects
          </h2>
          <p className="text-black text-sm">
            Admin has reviewed your pricing. Please check their offers below.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#F9FAFB] rounded-lg overflow-hidden p-5 border-1 border-[#EAEAEA]">
          {/* Level Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {negotiationData.level}
            </h3>
            <button className="text-red-500 hover:text-red-700 text-sm font-medium">
              Remove
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-3 pl-2 text-left text-sm font-medium text-gray-500">
                    Subject
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-500">
                    Your Price (£)
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-500">
                    Admin Offer (£)
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-500">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {negotiationData.items.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-1 border-[#EAEAEA]"
                  >
                    <td className="py-4 text-base font-medium text-gray-900 pl-2">
                      {item.subject}
                    </td>
                    <td className="py-4 text-center p-2">
                      <div className="flex justify-end">
                        <input
                          type="number"
                          value={item.yourPrice}
                          onChange={(e) =>
                            handlePriceChange(index, parseFloat(e.target.value))
                          }
                          className="w-25 px-1 py-2 text-base text-right border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent"
                          min="0"
                          step="1"
                        />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-25 px-3 py-2 text-base text-right border-2 border-teal-400 rounded-md bg-white text-teal-600 font-medium">
                          {item.adminOffer.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-start space-x-3">
                        <button
                          onClick={() =>
                            handleResponseChange(
                              index,
                              item.response === "accept" ? null : "accept"
                            )
                          }
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            item.response === "accept"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400 hover:bg-green-100 hover:text-green-600"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleResponseChange(
                              index,
                              item.response === "reject" ? null : "reject"
                            )
                          }
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            item.response === "reject"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-400 hover:bg-red-100 hover:text-red-600"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Admin Note */}
          {negotiationData.adminNote && (
            <div className="mt-14 p-3 bg-[#43939614] rounded-lg border border-[#43939614]">
              <div className="flex items-start space-x-2">
                <span className="text-base font-semibold text-gray-800">
                  Admin note:
                </span>
                <span className="text-base text-gray-800">
                  {negotiationData.adminNote}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={handleProposeNewPricing}
            disabled={!hasValidPrices}
            className="flex-1 px-6 py-2 border-2 border-red-300 text-red-600 bg-white rounded-full hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Propose New Pricing
          </button>
          <button
            onClick={handleAcceptOffer}
            disabled={!allResponsesGiven && !hasAcceptedItems}
            className="flex-1 px-6 py-2 bg-bgprimary text-white rounded-full hover:bg-bgprimary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept Offer
          </button>
        </div>
      </div>
    );
  }
);

PriceNegotiation.displayName = "PriceNegotiation";

export default PriceNegotiation;
