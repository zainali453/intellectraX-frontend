import InputField from "@/components/InputField";
import { useUser } from "@/context/UserContext";
import React from "react";

const Support = () => {
  const { user } = useUser();
  const [formData, setFormData] = React.useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    description: "",
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
            label='Email Address'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter your email address'
            autoComplete='email'
            disabled
          />
          <InputField
            label='Full Name'
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder='Enter your full name'
            autoComplete='name'
            disabled
          />
        </div>
        <div className='mt-3'>
          <InputField
            required
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Enter your description'
            autoComplete='off'
            as='textarea'
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
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Support;
