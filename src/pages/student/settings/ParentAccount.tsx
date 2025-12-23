import InputField from "@/components/InputField";
import { useUser } from "@/context/UserContext";
import React, { use } from "react";

const ParentAccount = () => {
  const { user } = useUser();
  const [formData, setFormData] = React.useState({
    parentEmail: "",
    parentContactNumber: "",
  });
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsUpdated(true);
  };

  return (
    <div className=''>
      <>
        {/* Email and Full Name Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
          <InputField
            label='Parent Email Address'
            type='email'
            name='parentEmail'
            value={formData.parentEmail}
            onChange={handleInputChange}
            placeholder='Enter your parent email address'
            autoComplete='email'
            required
          />
          <InputField
            label='Parent Contact Number'
            type='tel'
            name='parentContactNumber'
            value={formData.parentContactNumber}
            onChange={handleInputChange}
            placeholder='Enter your parent contact number'
            autoComplete='tel'
            required
          />
        </div>
      </>
      {isUpdated && (
        <div className='flex justify-end flex-1 items-end mt-4'>
          <button
            type='submit'
            disabled={isLoading || !isUpdated}
            className={`py-2 px-6 rounded-3xl font-medium transition-colors duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-bgprimary hover:bg-teal-600 cursor-pointer text-white"
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentAccount;
