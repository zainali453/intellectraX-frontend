import { useState } from "react";
import InputField from "@/components/InputField";

interface PricingDetailsType {
  pricingFName: string;
  pricingLName: string;
  pricingSortCode: string;
  pricingAccountNumber: string;
}

const BankDetails = () => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<PricingDetailsType>({
    pricingFName: "",
    pricingLName: "",
    pricingSortCode: "",
    pricingAccountNumber: "",
  });

  const handleInputChange = (
    field: keyof PricingDetailsType,
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    // onChange(updatedData);
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
    <div className='space-y-6 mt-8 px-1'>
      <InputField
        label='First Name'
        name='firstName'
        value={formData.pricingFName}
        onChange={(e) => handleInputChange("pricingFName", e.target.value)}
        placeholder='Enter first name'
        required
      />

      <InputField
        label='Last Name'
        name='lastName'
        value={formData.pricingLName}
        onChange={(e) => handleInputChange("pricingLName", e.target.value)}
        placeholder='Enter last name'
        required
      />

      <InputField
        label='Sort Code'
        name='sortCode'
        value={formData.pricingSortCode}
        onChange={(e) => handleSortCodeChange(e.target.value)}
        placeholder='XX-XX-XX'
        required
      />

      <InputField
        label='Account Number'
        name='accountNumber'
        value={formData.pricingAccountNumber}
        onChange={(e) => handleAccountNumberChange(e.target.value)}
        placeholder='Enter 8-digit account'
        required
      />
      {isUpdated && (
        <div className='flex justify-end flex-1 items-end mt-4'>
          <button
            type='submit'
            disabled={isLoading || !isUpdated}
            className={`py-2 px-4 rounded-3xl font-medium transition-colors duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-bgprimary hover:bg-teal-600 cursor-pointer text-white"
            }`}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BankDetails;
