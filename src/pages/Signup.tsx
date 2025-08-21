import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import CustomIcon, { IconName } from "../components/CustomIcon";
import { useNavigate } from "react-router-dom";

const roleData: Array<{
  id: string;
  title: string;
  icon: IconName;
  customStyle?: string;
}> = [
  {
    id: "teacher",
    title: "I am Teacher",
    icon: "openBook",
  },
  {
    id: "student",
    title: "I am Student",
    icon: "studentCap",
  },
  {
    id: "parent",
    title: "I am Parent",
    icon: "users",
    customStyle: "w-13 h-[40px]",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const handleRoleSelection = (roleId: string) => {
    navigate("/register?role=" + roleId);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-4xl">
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-textprimary mb-2">
          Welcome to IntellectraX
        </h2>
        <p className="text-black text-base">Choose your role to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roleData.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className="text-center border border-gray-200 rounded-[16px] pt-10 px-6 pb-6 flex flex-col gap-7"
            >
              <div className="w-13 h-13 flex items-center justify-center mx-auto">
                <CustomIcon
                  name={role.icon}
                  className={role.customStyle || "w-13 h-13"}
                />
              </div>
              <h3 className="text-xl font-medium text-textprimary">
                {role.title}
              </h3>
              <button
                onClick={() => handleRoleSelection(role.id)}
                className="bg-bgprimary hover:bg-teal-600 cursor-pointer text-white px-12 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Signup;

// {
//   /* {showSignIn ? (
//           <Navigate to="/signin" replace />
//         ) : !showRegister ? ( */
// }

// ) : showOTP ? (
//   <OTP
//     email={formData.email}
//     signupData={formData}
//     onSuccess={handleOTPSuccess}
//   />
// ) : (
//   <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
//     {/* Registration Form Only */}
//     <div className="text-center mb-8 pt-8">
//       <h2 className="text-3xl font-bold text-gray-900 mb-4">
//         Register
//       </h2>
//       <p className="text-gray-600 text-sm">
//         {selectedRole === "parent"
//           ? "Please provide the following information to set up your Parent Portal account."
//           : "Please provide the following information to set up your Student Portal account."}
//       </p>
//     </div>
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <div className="bg-red-50 text-red-500 p-3 rounded-md">
//           {error}
//         </div>
//       )}
//       {/* Email and Full Name Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Email"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Full Name
//           </label>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleInputChange}
//             placeholder="Full Name"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />
//         </div>
//       </div>
//       {/* Mobile Number and Date of Birth Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Mobile Number
//           </label>
//           <input
//             type="tel"
//             name="mobileNumber"
//             value={formData.mobileNumber}
//             onChange={handleInputChange}
//             placeholder="Mobile Number"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date of Birth
//           </label>
//           <div className="relative">
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               required
//             />
//             <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//       </div>
//       {/* Location and Gender Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Location <span className="text-gray-400">(Optional)</span>
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleInputChange}
//               placeholder="Select Location"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             />
//             <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Gender
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>
//       </div>
//       {/* Password and Confirm Password Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleInputChange}
//               placeholder="Confirm Password"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
//               required
//             />
//             <button
//               type="button"
//               onClick={() =>
//                 setShowConfirmPassword(!showConfirmPassword)
//               }
//               className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
//             >
//               {showConfirmPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* Sign Up Button */}
//       <button
//         type="submit"
//         className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-3xl font-medium transition-colors duration-200"
//       >
//         Sign Up
//       </button>
//       {/* Sign In Link */}
//       <div className="text-center">
//         <p className="text-gray-600">
//           Already have an account?{" "}
//           <a
//             href="/signin"
//             className="text-teal-600 hover:text-bgprimary font-medium"
//           >
//             Sign In
//           </a>
//         </p>
//       </div>
//       <SocialLogin />
//     </form>
//   </div>
// )}
