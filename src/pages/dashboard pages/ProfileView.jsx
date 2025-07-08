import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useUser } from '../../context/UserContext'
import Subjects from '../onboarding components/Subjects';
import AuthService from '../../services/auth.service';
import BioQualifications from '../onboarding components/BioQualification';
import AvailabilitySchedule from '../onboarding components/AvailabilitySchedule';
import PricingDetails from '../onboarding components/PricingDetails';
import ClassSubjects from '../onboarding components/ClassSubjects';
import LearningGoals from '../onboarding components/LearningGoals';

const ProfileView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser(); // Destructure user from context
    const verificationData = location.state?.verificationData;
    const isSettingsRoute = location.pathname === '/dashboard/settings';
    const [activeTab, setActiveTab] = useState('Profile');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [teacherProfile, setTeacherProfile] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    
    // Initialize with empty/default values - will be populated from API
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        mobileNumber: '',
        dateOfBirth: '',
        location: '',
        gender: '',
        bio: '',
        qualifications: [],
        availability: {},
        pricing: {}
    });

    // Student-specific form data
    const [studentFormData, setStudentFormData] = useState({
        email: '',
        fullName: '',
        mobileNumber: '',
        dateOfBirth: '',
        location: '',
        gender: '',
        className: '',
        subjects: [],
        learningGoals: '',
        availability: [],
        parentEmail: '',
        parentContact: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [availabilitySlots, setAvailabilitySlots] = useState([]);

    const [pricingSlots, setPricingSlots] = useState([]);

    const [paymentDetails, setPaymentDetails] = useState({
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    const { email: paramEmail, role: paramRole } = useParams();
    // Always use email from URL if present, otherwise from context
    const emailForProfile = paramEmail || user?.email || '';
    const roleForProfile = paramRole || user?.role || 'Teacher';

    // Normalize role for API
    const normalizedRole = (() => {
        const r = (roleForProfile || '').toLowerCase();
        if (r === 'teachers' || r === 'teacher') return 'teacher';
        if (r === 'students' || r === 'student') return 'student';
        if (r === 'parents' || r === 'parent') return 'parent';
        return r;
    })();

    // Log which email is being used for profile fetch
    useEffect(() => {
        console.log('[ProfileView] Using email for profile:', emailForProfile, 'and role:', normalizedRole);
    }, [emailForProfile, normalizedRole]);

    // Fetch profile data on component mount
    useEffect(() => {
        if (emailForProfile) {
            if (normalizedRole === 'student' || normalizedRole === 'parent') {
                fetchStudentProfile(emailForProfile, normalizedRole);
            } else if (normalizedRole === 'teacher') {
                fetchTeacherProfile(emailForProfile, normalizedRole);
            }
        } else {
            setError('No email found to fetch profile data');
        }
        // Cleanup on unmount: reset all state
        return () => {
            setProfileImage(null);
            setLoading(false);
            setError('');
            setTeacherProfile(null);
            setStudentProfile(null);
            setFormData({
                email: '',
                fullName: '',
                mobileNumber: '',
                dateOfBirth: '',
                location: '',
                gender: '',
                bio: '',
                qualifications: [],
                availability: {},
                pricing: {}
            });
            setStudentFormData({
                email: '',
                fullName: '',
                mobileNumber: '',
                dateOfBirth: '',
                location: '',
                gender: '',
                className: '',
                subjects: [],
                learningGoals: '',
                availability: [],
                parentEmail: '',
                parentContact: ''
            });
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setSelectedSubjects([]);
            setAvailabilitySlots([]);
            setPricingSlots([]);
            setPaymentDetails({
                cardHolder: '',
                cardNumber: '',
                expiryDate: '',
                cvc: ''
            });
        };
    }, [emailForProfile, normalizedRole]);

    // Update form data when profile is fetched
    useEffect(() => {
        if (teacherProfile && normalizedRole !== 'student') {
            updateFormDataFromProfile(teacherProfile);
        } else if (studentProfile && normalizedRole === 'student') {
            updateStudentFormDataFromProfile(studentProfile);
        }
    }, [teacherProfile, studentProfile, normalizedRole]);

    const fetchStudentProfile = async (email, role) => {
        try {
            setLoading(true);
            setError('');
            const response = await AuthService.getTeacherProfile(email, role);
            
            if (response.success) {
                setStudentProfile(response.data);
            } else {
                setError('Failed to fetch student profile');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch student profile');
        } finally {
            setLoading(false);
        }
    };

    const updateStudentFormDataFromProfile = (profile) => {
        // Update basic form data
        setStudentFormData(prev => ({
            ...prev,
            email: profile.email || '',
            fullName: profile.name || '',
            mobileNumber: profile.mobileNumber || profile.phone || '',
            dateOfBirth: profile.dob ? profile.dob.split('T')[0] : '',
            location: profile.location || '',
            gender: profile.gender || '',
            className: profile.className || profile.academicInfo?.className || '',
            subjects: profile.subjects || profile.academicInfo?.subjects || [],
            learningGoals: profile.learningGoals || '',
            availability: profile.availability || [],
            parentEmail: profile.parentEmail || profile.parentInfo?.email || '',
            parentContact: profile.parentContact || profile.parentInfo?.number || ''
        }));

        // Update profile image
        if (profile.profilePicture) {
            setProfileImage(profile.profilePicture);
        }

        // Update subjects from profile
        if (profile.subjects && profile.subjects.length > 0) {
            const subjectNames = profile.subjects.map(sub => 
                typeof sub === 'string' ? sub : sub.subject
            );
            setSelectedSubjects(subjectNames);
        }

        // Update availability slots
        if (profile.availability && profile.availability.length > 0) {
            const availabilityData = profile.availability.map((slot, index) => ({
                id: index + 1,
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            }));
            setAvailabilitySlots(availabilityData);
        } else {
            // Set default empty slot if no availability
            setAvailabilitySlots([
                { id: 1, day: 'Monday', startTime: '09:00', endTime: '17:00' }
            ]);
        }
    };

    const fetchTeacherProfile = async (email, role) => {
        try {
            setLoading(true);
            setError('');
            const response = await AuthService.getTeacherProfile(email, role);
            
            if (response.success) {
                setTeacherProfile(response.data);
            } else {
                setError('Failed to fetch teacher profile');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch teacher profile');
        } finally {
            setLoading(false);
        }
    };

    const updateFormDataFromProfile = (profile) => {
        // Update basic form data
        setFormData(prev => ({
            ...prev,
            email: profile.email || '',
            fullName: profile.name || '',
            mobileNumber: profile.mobileNumber || profile.phone || '',
            dateOfBirth: profile.dob ? profile.dob.split('T')[0] : '',
            location: profile.location || '',
            gender: profile.gender,
            bio: profile.bio || '',
            qualifications: profile.qualifications || [],
        }));

        // Update profile image
        if (profile.profilePicture) {
            setProfileImage(profile.profilePicture);
        }

        // Update subjects from profile
        if (profile.subjects && profile.subjects.length > 0) {
            const subjectNames = profile.subjects.map(sub => 
                typeof sub === 'string' ? sub : sub.subject
            );
            setSelectedSubjects(subjectNames);
        }

        // Update availability slots
        if (profile.availability && profile.availability.length > 0) {
            const availabilityData = profile.availability.map((slot, index) => ({
                id: index + 1,
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            }));
            setAvailabilitySlots(availabilityData);
        } else {
            // Set default empty slot if no availability
            setAvailabilitySlots([
                { id: 1, day: 'Monday', startTime: '09:00', endTime: '17:00' }
            ]);
        }

        // Update pricing slots
        if (profile.pricing && profile.pricing.length > 0) {
            const pricingData = profile.pricing.map((slot, index) => ({
                id: index + 1,
                price: slot.price ? slot.price.toString() : ''
            }));
            setPricingSlots(pricingData);
        } else {
            // Set default empty slot if no pricing
            setPricingSlots([
                { id: 1, price: '' }
            ]);
        }

        // Update payment details
        if (profile.cardDetails) {
            setPaymentDetails({
                cardHolder: profile.cardDetails.cardHolder || '',
                cardNumber: profile.cardDetails.cardNumber || '',
                expiryDate: profile.cardDetails.expiryDate || '',
                cvc: profile.cardDetails.cvv || profile.cardDetails.cvc || ''
            });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            
            if (activeTab === 'Security') {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    alert('New passwords do not match!');
                    return;
                }
                // Call password update API
            } else {
                if (normalizedRole === 'student') {
                    // Prepare student data for profile update
                    const updateData = {
                        ...studentFormData,
                        subjects: studentFormData.subjects,
                        availability: studentFormData.availability,
                        ...(profileImage && { profilePicture: profileImage })
                    };
                    // Call student profile update API
                    await AuthService.updateProfile(updateData, normalizedRole);
                } else {
                    // Prepare data for teacher profile update
                    const updateData = {
                        ...formData,
                        subjects: selectedSubjects.map(sub => ({ subject: sub })),
                        availability: availabilitySlots,
                        pricing: pricingSlots,
                        cardDetails: paymentDetails
                    };
                    // Call teacher profile update API
                    await AuthService.updateProfile(updateData, normalizedRole);
                }
            }
        } catch (error) {
            setError('Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (activeTab === 'Security') {
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            // Reset form data to original values from profile
            if (normalizedRole === 'student' && studentProfile) {
                updateStudentFormDataFromProfile(studentProfile);
            } else if (teacherProfile) {
                updateFormDataFromProfile(teacherProfile);
            }
        }
    };

    const handleRetryFetch = () => {
        if (emailForProfile) {
            if (normalizedRole === 'student') {
                fetchStudentProfile(emailForProfile, normalizedRole);
            } else {
                fetchTeacherProfile(emailForProfile, normalizedRole);
            }
        }
    };

    const showBackButton = location.pathname.includes('/dashboard/');

    const renderTabContent = () => {
        if (normalizedRole === 'Admin' && activeTab !== 'Profile' && activeTab !== 'Security') {
            return null;
        }
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="text-teal-600">Loading profile...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button 
                        onClick={handleRetryFetch}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        // Student-specific content
        if (normalizedRole === 'student') {
            switch (activeTab) {
                case 'Profile':
                    return (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={studentFormData.email}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        readOnly={!!verificationData}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={studentFormData.fullName}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        readOnly={!!verificationData}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={studentFormData.mobileNumber}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={studentFormData.dateOfBirth}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={studentFormData.location}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select
                                        value={studentFormData.gender}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, gender: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    );
                case 'Class & Subjects':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Class & Subjects</h3>
                            <ClassSubjects
                                data={{
                                    profilePicture: profileImage,
                                    className: studentFormData.className,
                                    subjects: studentFormData.subjects
                                }}
                                onChange={(updated) => setStudentFormData(prev => ({ ...prev, ...updated }))}
                            />
                        </div>
                    );
                case 'Learning Goals':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Learning Goals</h3>
                            <LearningGoals
                                learningGoals={studentFormData.learningGoals}
                                onChange={(goals) => setStudentFormData(prev => ({ ...prev, learningGoals: goals }))}
                            />
                        </div>
                    );
                case 'Availability Schedule':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Availability Schedule</h3>
                            <AvailabilitySchedule
                                slots={studentFormData.availability}
                                onChange={(availability) => setStudentFormData(prev => ({ ...prev, availability }))}
                            />
                        </div>
                    );
                case 'Parent Account':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Parent Account</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                                    <input
                                        type="email"
                                        value={studentFormData.parentEmail}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                                        placeholder="Enter parent's email address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Contact Number</label>
                                    <input
                                        type="tel"
                                        value={studentFormData.parentContact}
                                        onChange={(e) => setStudentFormData(prev => ({ ...prev, parentContact: e.target.value }))}
                                        placeholder="Enter parent's contact number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                case 'Support':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Support</h3>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-600 mb-4">
                                    Need help? Contact our support team for assistance with your account or any technical issues.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-700">Email:</span>
                                        <span className="text-teal-600">support@intellectrax.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-700">Phone:</span>
                                        <span className="text-teal-600">+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-700">Hours:</span>
                                        <span className="text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'Security':
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                                    placeholder="Enter your current password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    placeholder="Enter your new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            {passwordData.newPassword && passwordData.confirmPassword &&
                                passwordData.newPassword !== passwordData.confirmPassword && (
                                    <p className="text-sm text-red-600">Passwords do not match</p>
                                )}
                        </div>
                    );
                default:
                    return null;
            }
        }

        // Teacher/Admin content (existing logic)
        switch (activeTab) {
            case 'Profile':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    readOnly={!!verificationData}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    readOnly={!!verificationData}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-gray-400">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Bio & Qualification':
                return (
                    <BioQualifications
                        qualifications={teacherProfile.qualifications}
                        bio= {teacherProfile.bio}
                        onChange={(updated) => setFormData(prev => ({ ...prev, ...updated }))}
                    />
                );
            case 'Subjects':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
                        <Subjects selectedSubjects={teacherProfile.subjects} />
                    </div>
                );
            case 'Availability':
                return (
                    <AvailabilitySchedule
                        slots={teacherProfile.availability}
                        onChange={setAvailabilitySlots}
                    />
                );
            case 'Pricing':
                return (
                    <PricingDetails
                        PricingDetails={teacherProfile.pricing}
                        cardDetails = {teacherProfile.cardDetails}
                        onPricingChange={setPricingSlots}
                        onCardDetailsChange={setPaymentDetails}
                    />
                );
            case 'Security':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                                placeholder="Enter your current password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                placeholder="Confirm your new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        {passwordData.newPassword && passwordData.confirmPassword &&
                            passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-sm text-red-600">Passwords do not match</p>
                            )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h2 className="text-4xl font-semibold text-gray-600">
                        {isSettingsRoute ? "Settings" : "Teacher Profile View"}
                    </h2>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Left Column - Profile Image and Navigation */}
                <div className="w-64 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="relative">
                            <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full overflow-hidden">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profile-image-upload"
                                className="absolute bottom-0 right-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-image-upload"
                            />
                        </div>


                    {/* Navigation Menu */}
                    <div className="bg-white mt-10 overflow-hidden">
                        {(normalizedRole === 'Admin'
                            ? [
                                'Profile',
                                'Security',
                                ...(isSettingsRoute ? [] : [])
                            ]
                            : normalizedRole === 'student'
                            ? [
                                'Profile',
                                'Class & Subjects',
                                'Learning Goals',
                                'Availability Schedule',
                                'Parent Account',
                                'Support',
                                ...(isSettingsRoute ? ['Security'] : [])
                            ]
                            : [
                                'Profile',
                                'Bio & Qualification',
                                'Subjects',
                                'Availability',
                                'Pricing',
                                ...(isSettingsRoute ? ['Security'] : [])
                            ]
                        ).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full px-6 py-3 text-left transition-colors
                                    ${activeTab === tab
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                </div>

                {/* Right Column - Content */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
                    {renderTabContent()}
                    {activeTab !== 'Security' && (
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView; 