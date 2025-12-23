import DatePicker from "@/components/DatePicker";
import InputField from "@/components/InputField";
import LoadingSpinner from "@/components/LoadingSpinner";
import PasswordInput from "@/components/PasswordInput";
import SelectField from "@/components/SelectField";
import { useUser } from "@/context/UserContext";
import { adminService } from "@/services/admin.service";
import React, { use, useEffect } from "react";

const tabs = [
  { id: "account", label: "Account Details" },
  { id: "security", label: "Security" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const Account = () => {
  const [activeTab, setActiveTab] = React.useState<string>("account");
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const { user, updateUserFromCookies } = useUser();
  const [isFetching, setIsFetching] = React.useState(true);
  const [formData, setFormData] = React.useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    mobileNumber: "",
    dateOfBirth: null as Date | null,
    gender: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsFetching(true);
        const profileData = await adminService.getProfile();
        setFormData((prevData) => ({
          ...prevData,
          fullName: profileData.fullName || "",
          mobileNumber: profileData.mobileNumber || "",
          dateOfBirth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth)
            : null,
          gender: profileData.gender || "",
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfileData();
  }, []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUpdated, setIsUpdated] = React.useState(false);

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

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
    setIsUpdated(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (formData.password !== formData.confirmPassword) {
        alert("Password and Confirm Password do not match.");
        return;
      }
      const response = await adminService.updateProfile(formData);
      console.log("Update profile response:", response);
      if (response.success) {
        setIsUpdated(false);
        updateUserFromCookies();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        currentPassword: "",
      });
    }
  };
  return (
    <div className=''>
      <div>
        <nav className='mb-6 flex flex-row justify-between items-center'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 cursor-pointer py-1 px-1 border-b-3 font-medium text-base transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-bgprimary text-bgprimary"
                  : "border-[#E3E3E8] text-gray-400 hover:text-bgprimary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isFetching ? (
        <div className='flex justify-center items-center h-60'>
          <LoadingSpinner size='lg' />
        </div>
      ) : activeTab === "account" ? (
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
              required
              autoComplete='name'
            />
          </div>

          {/* Mobile Number and Date of Birth Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <InputField
              label='Mobile Number'
              type='tel'
              name='mobileNumber'
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder='Enter your mobile number'
              required
              autoComplete='tel'
            />
            <DatePicker
              label='Date of Birth'
              name='dateOfBirth'
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              placeholder='Select your date of birth'
              required
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dateFormat='MM/dd/yyyy'
            />
          </div>

          {/* Location and Gender Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <SelectField
              label='Gender'
              name='gender'
              value={formData.gender}
              onChange={handleInputChange}
              placeholder='Select your gender'
              options={genderOptions}
              required
            />
          </div>
        </>
      ) : (
        <>
          {/* Password and Confirm Password Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
            <PasswordInput
              label='Current Password'
              name='currentPassword'
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder='Enter your current password'
              required
              autoComplete='new-password'
            />
            <PasswordInput
              label='Password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Create a strong password'
              required
              autoComplete='new-password'
            />
            <PasswordInput
              label='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder='Confirm your password'
              required
              autoComplete='new-password'
            />
          </div>
        </>
      )}
      {isUpdated && (
        <div className='flex justify-end flex-1 items-end mt-4'>
          <button
            type='submit'
            disabled={isLoading || !isUpdated}
            onClick={handleSave}
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

export default Account;
