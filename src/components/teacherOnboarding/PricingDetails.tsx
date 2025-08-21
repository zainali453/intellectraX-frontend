import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import InputField from "../InputField";

interface FormData {
  firstName: string;
  lastName: string;
  sortCode: string;
  accountNumber: string;
}

interface PricingDetailsProps {
  onDataChange?: (data: FormData) => void;
}

interface PricingDetailsRef {
  getData: () => FormData;
}

const PricingDetails = forwardRef<PricingDetailsRef, PricingDetailsProps>(
  (props, ref) => {
    const [formData, setFormData] = useState<FormData>({
      firstName: "",
      lastName: "",
      sortCode: "",
      accountNumber: "",
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
      const updatedData = { ...formData, [field]: value };
      setFormData(updatedData);

      // Send data to parent if callback is provided
      if (props.onDataChange) {
        props.onDataChange(updatedData);
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getData: () => formData,
    }));

    // Format sort code with dashes
    const handleSortCodeChange = (value: string) => {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");
      // Format as XX-XX-XX
      const formatted = digits.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
      handleInputChange("sortCode", formatted);
    };

    // Format account number to only allow digits
    const handleAccountNumberChange = (value: string) => {
      // Remove all non-digits and limit to 8 digits
      const digits = value.replace(/\D/g, "").slice(0, 8);
      handleInputChange("accountNumber", digits);
    };

    return (
      <div className="space-y-6 mt-8 px-1">
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Enter first name"
          required
        />

        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          placeholder="Enter last name"
          required
        />

        <InputField
          label="Sort Code"
          name="sortCode"
          value={formData.sortCode}
          onChange={(e) => handleSortCodeChange(e.target.value)}
          placeholder="XX-XX-XX"
          required
        />

        <InputField
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => handleAccountNumberChange(e.target.value)}
          placeholder="Enter 8-digit account"
          required
        />
      </div>
    );
  }
);

export default PricingDetails;
