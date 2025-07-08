import { BookOpen, GraduationCap, Users, Eye, EyeOff, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OTP from '../components/OTP';
import SocialLogin from '../components/SocialLogin';
import AuthService from '../services/auth.service';
import { useUser } from '../context/UserContext';
import StudentRegistrationForm from './onboarding components/StudentRegistrationForm';

const Signup = ({ forceStudentInner = false, onSuccess, parentInfo = null }) => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const roleData = [
    {
      id: 'teacher',
      title: 'I am Teacher',
      icon: BookOpen,
    },
    {
      id: 'student',
      title: 'I am Student',
      icon: GraduationCap,
    },
    {
      id: 'parent',
      title: 'I am Parent',
      icon: Users,
    }
  ];

  const [selectedRole, setSelectedRole] = useState(forceStudentInner ? 'student' : (parentInfo ? 'parent' : null));
  const [showRegister, setShowRegister] = useState(forceStudentInner || parentInfo ? true : false);
  const [showOTP, setShowOTP] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [signupToken, setSignupToken] = useState(null); // Store token temporarily
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    mobileNumber: '',
    dateOfBirth: '',
    location: '',
    role: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  // Set role when parentInfo is provided (parent onboarding flow)
  useEffect(() => {
    if (parentInfo && !forceStudentInner) {
      setSelectedRole('parent');
      setFormData(prev => ({ ...prev, role: 'parent' }));
    }
  }, [parentInfo, forceStudentInner]);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    formData.role = role;
    setShowRegister(true);
    console.log(`Selected role: ${role}`);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Ensure role is set
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    try {
      console.log('Starting signup with role:', selectedRole);
      
      // If this is a student being created by a parent, include parent info
      const signupPayload = {
        ...formData,
        role: selectedRole
      };
      
      if (forceStudentInner && parentInfo) {
        signupPayload.parentEmail = parentInfo.email;
        signupPayload.parentPhone = parentInfo.phone;
      }
      
      const response = await AuthService.signup(signupPayload);

      console.log('Signup response:', response);

      if(response.message === 'Email already exists') {
        setError('Email already exists. Please sign in instead.');
        return;
      }

      // Store token temporarily instead of updating user context immediately
      if (response.token) {
        console.log('Token received during signup, storing temporarily');
        setSignupToken(response.token);
      }

      // If forceStudentInner is true, call onSuccess with form data for parent onboarding
      if (forceStudentInner && onSuccess) {
        onSuccess(formData);
        return;
      }

      // Show OTP screen regardless of role
      console.log('Signup successful, showing OTP screen');
      setShowOTP(true);

    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleVerifyOTP = async (otp) => {
    const response = await AuthService.verifyOTP(formData, otp);
    return response.success;
  };

  const handleOTPSuccess = async (response) => {
    if (!response || !response.success) {
      console.error('Invalid verification response:', response);
      return;
    }

    console.log('OTP verification response:', response);

    // Now update user context with complete information after OTP verification
    const userData = {
      isAuthenticated: true,
      token: response.token,
      email: response.user.email,
      role: response.user.role,
      verified: response.user.verified,
      onboarding: response.user.onboarding,
      picture: response.user.picture
    };

    console.log('Updating user context with complete data after OTP verification:', userData);
    updateUser(userData);

    // Clear temporary token
    setSignupToken(null);

    // Route based on role after successful verification
    // Backend returns "Teacher" (capitalized), so we need to handle both cases
    const userRole = response.user.role || selectedRole;
    if (userRole.toLowerCase() === 'teacher') {
      console.log('Teacher verified, redirecting to onboarding');
      navigate('/onboarding');
    } else if (userRole.toLowerCase() === 'student') {
      console.log('Student verified, redirecting to onboarding');
      navigate('/onboarding');
    } else {
      console.log('Other user verified, redirecting to verification pending');
      navigate('/verification-pending'); // for admin or other roles
    }
  };

  const handleResendOTP = async () => {
    const response = await AuthService.resendOTP(formData);
    return response.success;
  };

  return (
    forceStudentInner ? (
      <StudentRegistrationForm onSuccess={onSuccess} parentInfo={parentInfo} />
    ) : (
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          {showSignIn ? (
            navigate('/signin')
          ) : !showRegister ? (
            // Role Selection Card
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-600 mb-4">Welcome to IntellectraX</h2>
                <p className="text-gray-600 text-lg">Choose your role to get started.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {roleData.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.id} className="text-center border border-gray-200 rounded-2xl p-4">
                      <div className="bg-teal-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-10 h-10 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">{role.title}</h3>
                      <button 
                        onClick={() => handleRoleSelection(role.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-full font-medium transition-colors duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : showOTP ? (
            <OTP 
              email={formData.email}
              signupData={formData}
              onSuccess={handleOTPSuccess}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
              {/* Registration Form Only */}
              <div className="text-center mb-8 pt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Register</h2>
                <p className="text-gray-600 text-sm">
                  {selectedRole === 'parent' 
                    ? 'Please provide the following information to set up your Parent Portal account.'
                    : 'Please provide the following information to set up your Student Portal account.'
                  }
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md">
                    {error}
                  </div>
                )}
                {/* Email and Full Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                {/* Mobile Number and Date of Birth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                {/* Location and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-gray-400">(Optional)</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Select Location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                {/* Password and Confirm Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-3xl font-medium transition-colors duration-200"
                >
                  Sign Up
                </button>
                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="text-teal-600 hover:text-teal-700 font-medium">
                      Sign In
                    </a>
                  </p>
                </div>
                <SocialLogin />
              </form>
            </div>
          )}
        </main>
      </div>
    )
  );
};

export default Signup;