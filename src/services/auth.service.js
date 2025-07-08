import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_API_URL;

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Function to get role from UserContext or fallback to parameter
const getRoleFromContext = (fallbackRole) => {
  if (fallbackRole) return fallbackRole.toLowerCase();
  try {
    // Try to get role from localStorage (UserContext stores it there)
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser?.role?.toLowerCase() || undefined;
  } catch (error) {
    console.warn('Could not get role from context, using fallback:', fallbackRole);
    return undefined;
  }
};

// Function to handle JWT expiration
const handleJWTExpiration = () => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  
  // Clear auth header
  delete api.defaults.headers.common['Authorization'];
  
  // Dispatch a custom event to notify components about JWT expiration
  const jwtExpiredEvent = new CustomEvent('jwtExpired', {
    detail: {
      message: 'Your session has expired. Please log in again.'
    }
  });
  window.dispatchEvent(jwtExpiredEvent);
};

// Global error interceptor for JWT expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to JWT expiration
    if (error.response?.data?.error === "jwt expired" || 
        error.response?.data?.message === "Invalid token" ||
        error.response?.status === 401) {
      
      // Handle JWT expiration
      handleJWTExpiration();
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  async login(email, password) {
    try {
      console.log("🔍 [AuthService] Starting login for email:", email);
      const response = await api.post('/user/login', {
        email,
        password,
      });
      
      console.log("📥 [AuthService] Raw response data:", response.data);
      
      if (response.data.token) {
        console.log("🔍 [AuthService] Token found, checking user data structure...");
        console.log("🔍 [AuthService] response.data.user:", response.data.user);
        console.log("🔍 [AuthService] onboarding value:", response.data.user?.onboarding);
        console.log("🔍 [AuthService] verified value:", response.data.user?.verified);
        
        const userToStore = {
          token: response.data.token,
          email: response.data.user.email,
          role: response.data.user.role,
          picture: response.data.user.picture || null,
          onboarding: response.data.user?.onboarding || false,
          verified: response.data.user?.verified || 'pending',
          profile: response.data.user?.profile || null
        };
        
        console.log("💾 [AuthService] Storing user in localStorage:", userToStore);
        localStorage.setItem('user', JSON.stringify(userToStore));
        
        // Set token for subsequent requests
        this.setAuthHeader(response.data.token);
      }
      
      const returnData = {
        ...response.data,
        role: response.data.user.role,
        success: true,
        onboarding: response.data.user?.onboarding || false,
        verified: response.data.user?.verified || 'pending',
        picture: response.data.user.picture || null,
        profile: response.data.user?.profile || null
      };
      
      console.log("📤 [AuthService] Returning data:", returnData);
      return returnData;
    } catch (error) {
      console.error('❌ [AuthService] Login error:', error);
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  }

  setAuthHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }

  logout() {
    localStorage.removeItem('user');
    this.setAuthHeader(null);
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log('🔍 [AuthService] No user data found in localStorage');
        return null;
      }
      const parsedUser = JSON.parse(userData);
      console.log('🔍 [AuthService] Retrieved user from localStorage:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('❌ [AuthService] Error parsing user data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  }

  async signup(signupData) {
    try {
      // Capitalize the role to match backend expectations
      const capitalizedRole = signupData.role.charAt(0).toUpperCase() + signupData.role.slice(1);
      
      const response = await api.post(`/user/signup`, {
        userId: signupData.userId || crypto.randomUUID(),
        bioData: {
          fullName: signupData.fullName,
          email: signupData.email,
          bio: signupData.bio || `${capitalizedRole} profile for ${signupData.fullName}`,
          mobileNumber: signupData.mobileNumber,
          dateOfBirth: signupData.dateOfBirth,
          location: signupData.location,
          gender: signupData.gender,
          profileImage: null
        },
        role: capitalizedRole,
        password: signupData.password
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  }

  async verifyOTP(signupData, otp) {
    try {
      otp = Number(otp);
      console.log('Verifying OTP:', otp);
      const response = await api.post(`/user/verify-email`, { code: otp, email: signupData.email });
      
      console.log('OTP verification response from backend:', response.data);
      
      // Set auth header if token is present
      if (response.data.token) {
        this.setAuthHeader(response.data.token);
      }

      // Return the actual backend response with additional profile data
      return {
        ...response.data,
        success: true,
        profile: {
          fullName: signupData.fullName,
          email: signupData.email,
          mobileNumber: signupData.mobileNumber,
          dateOfBirth: signupData.dateOfBirth,
          location: signupData.location,
          gender: signupData.gender,
          profileImage: null,
          bio: `${response.data.user?.role || signupData.role} profile for ${signupData.fullName}`
        }
      };
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  }

  async resendOTP(signupData) {
    try {
      const response = await api.post(`/user/resend-verification`, { email: signupData.email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP resend failed' };
    }
  }

  async completeOnboarding(userEmail, onboardingData, role) {
    console.log('🚀 [AuthService] Starting completeOnboarding for role:', role);
    console.log('📤 [AuthService] Request payload:', { userEmail, ...onboardingData });
    
    // Use role from context if available, otherwise use the parameter
    const userRole = getRoleFromContext(role);
    console.log('🎭 [AuthService] Using role:', userRole);
    
    try {
      const response = await api.post(`/${userRole.toLowerCase()}/complete-onboarding`,
        {
          userEmail,
          ...onboardingData
        }
      );
      
      console.log('📥 [AuthService] Backend response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [AuthService] completeOnboarding error:', error);
      console.error('❌ [AuthService] Error response:', error.response?.data);
      throw error.response?.data || { message: 'Onboarding completion failed' };
    }
  }

  async getUser(status, num = 10, page = 1, role) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      // Get userRole from context and current user
      const currentUser = this.getCurrentUser();
      const userRole = getRoleFromContext();
      const isAdmin = userRole && userRole.toLowerCase() === 'admin';

      // Normalize requested role to singular for admin
      let roleParam;
      if (isAdmin) {
        // Only allow Teacher, Student, Parent as role param for admin
        const roleMap = {
          teachers: 'Teacher',
          teacher: 'Teacher',
          students: 'Student',
          student: 'Student',
          parents: 'Parent',
          parent: 'Parent',
        };
        roleParam = roleMap[(role || '').toLowerCase()] || role;
      } else {
        // For non-admins, use the user's email as the role param
        roleParam = currentUser?.email;
      }

      // Endpoint is always based on userRole from context
      const endpoint = `/${userRole.toLowerCase()}/list-users`;
      console.log('🎭 [AuthService] Endpoint:', endpoint, 'role param:', roleParam, 'userRole:', userRole);
      
      const response = await api.get(endpoint, { params: { status, num, page, role: roleParam } });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  }
  async getTeacherProfile(email, role) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      this.setAuthHeader(token);
      
      // Use role from context if available, otherwise use the parameter
      const userRole = getRoleFromContext(role);
      console.log('🎭 [AuthService] Using role for getTeacherProfile:', userRole);
      
      const response = await api.get(`/${userRole}/profile`, { params:{ email } });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw error.response?.data || { message: 'Failed to fetch teacher profile' };
    }
  }
  /**
   * url: /admin/set-teacher-status
   * url
   */
  // Initialize auth header from localStorage on service creation
  constructor() {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }
  async TeacherVerification(email, status) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      const response = await api.post('/admin/set-teacher-status', { email, status, role: 'Teacher' });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update teacher status' };
    }
  }
  async deleteUser(email) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      const response = await api.delete('/admin/delete-user', { data: { email } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete teacher' };
    }
  } 
  async updateProfile(profileData, role) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      // Use role from context if available, otherwise use the parameter
      let userRole = getRoleFromContext(role);
      if (!userRole) {
        const user = this.getCurrentUser();
        userRole = user?.role || 'Teacher';
      }
      console.log('🎭 [AuthService] Using role for updateProfile:', userRole);
      
      const endpoint = `/${userRole.toLowerCase()}/profile`;
      const response = await api.put(endpoint, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }

  async getUserProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      this.setAuthHeader(token);
      
      // Get role from context
      const userRole = getRoleFromContext();
      const user = this.getCurrentUser();
      const userEmail = user?.email;
      
      if (!userEmail) {
        throw new Error('User email not found');
      }
      
      if (!userRole) {
        throw new Error('User role not found');
      }
      
      console.log('🎭 [AuthService] Using role for getUserProfile:', userRole);
      
      const response = await api.get(`/${userRole.toLowerCase()}/profile`, { 
        params: { email: userEmail } 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  }

  async createClass({ subject, timeslots, studentEmail, description, perSessionPrice }) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      // Build payload according to backend requirements
      const payload = {
        subject,
        timeslots, // Array of timeslot objects: [{ day, startTime, endTime }, ...]
        studentEmail, // String
        description,
        perSessionPrice // Number
      };
      const response = await api.post('/class/create', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create class' };
    }
  }

  async connectStudentToTeacher(studentEmail, teacherEmail) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      const response = await api.post('/student/connect', {
        studentEmail,
        teacherEmail
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to connect student to teacher' };
    }
  }

  async getTeacherDetails(email) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      const response = await api.get('/teacher/details', { params: { email } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher details' };
    }
  }

  async getClasses() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      const response = await api.get('/class/list-users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  }

  async createAssignment(assignmentData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const payload = {
        heading: assignmentData.heading,
        description: assignmentData.description,
        studentEmail: assignmentData.studentEmail,
        startDate: assignmentData.startDate,
        dueDate: assignmentData.dueDate,
        fileUrl: assignmentData.fileUrl || null
      };
      
      const response = await api.post('/assignment/create', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create assignment' };
    }
  }

  async createQuiz(quizData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const payload = {
        heading: quizData.heading,
        description: quizData.description,
        studentEmail: quizData.studentEmail,
        startDate: quizData.startDate,
        dueDate: quizData.dueDate,
        duration: quizData.duration,
        manualPdf: quizData.manualPdf
      };
      
      const response = await api.post('/quiz/create', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create quiz' };
    }
  }

  async getTeacherAssignments() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const response = await api.get('/assignment/teacher');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher assignments' };
    }
  }

  async getStudentAssignments(studentEmail) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const response = await api.get('/assignment/student', {
        params: { studentEmail }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student assignments' };
    }
  }

  async getTeacherQuizzes() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const response = await api.get('/quiz/teacher');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher quizzes' };
    }
  }

  async getStudentQuizzes(studentEmail) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      this.setAuthHeader(token);
      
      const response = await api.get('/quiz/student', {
        params: { studentEmail }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student quizzes' };
    }
  }
}

export default new AuthService();