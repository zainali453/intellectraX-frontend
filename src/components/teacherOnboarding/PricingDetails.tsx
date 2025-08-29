import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import InputField from "../InputField";

interface PricingDetailsType {
  pricingFName: string;
  pricingLName: string;
  pricingSortCode: string;
  pricingAccountNumber: string;
}
interface PricingDetailsProps {
  onChange: (data: PricingDetailsType) => void;
  data: PricingDetailsType;
}

const PricingDetails = ({ onChange, data }: PricingDetailsProps) => {
  const [formData, setFormData] = useState<PricingDetailsType>({
    pricingFName: data.pricingFName,
    pricingLName: data.pricingLName,
    pricingSortCode: data.pricingSortCode,
    pricingAccountNumber: data.pricingAccountNumber,
  });

  const handleInputChange = (
    field: keyof PricingDetailsType,
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  // Format sort code with dashes
  const handleSortCodeChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format as XX-XX-XX
    const formatted = digits.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
    handleInputChange("pricingSortCode", formatted);
  };

  // Format account number to only allow digits
  const handleAccountNumberChange = (value: string) => {
    // Remove all non-digits and limit to 8 digits
    const digits = value.replace(/\D/g, "").slice(0, 8);
    handleInputChange("pricingAccountNumber", digits);
  };

  return (
    <div className="space-y-6 mt-8 px-1">
      <InputField
        label="First Name"
        name="firstName"
        value={formData.pricingFName}
        onChange={(e) => handleInputChange("pricingFName", e.target.value)}
        placeholder="Enter first name"
        required
      />

      <InputField
        label="Last Name"
        name="lastName"
        value={formData.pricingLName}
        onChange={(e) => handleInputChange("pricingLName", e.target.value)}
        placeholder="Enter last name"
        required
      />

      <InputField
        label="Sort Code"
        name="sortCode"
        value={formData.pricingSortCode}
        onChange={(e) => handleSortCodeChange(e.target.value)}
        placeholder="XX-XX-XX"
        required
      />

      <InputField
        label="Account Number"
        name="accountNumber"
        value={formData.pricingAccountNumber}
        onChange={(e) => handleAccountNumberChange(e.target.value)}
        placeholder="Enter 8-digit account"
        required
      />
    </div>
  );
};

export default PricingDetails;
