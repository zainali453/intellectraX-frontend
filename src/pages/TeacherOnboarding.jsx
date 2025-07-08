import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BioQualifications from './onboarding components/BioQualification';
import Subjects from './onboarding components/Subjects';
import AvailabilitySchedule from './onboarding components/AvailabilitySchedule';
import PricingDetails from './onboarding components/PricingDetails';
import AuthService from '../services/auth.service';
import { getStepContent, isStepValid } from '../utils/utils';
import { useUser } from '../context/UserContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { setOnboardingStatus } = useUser();
    
    // Get user data from localStorage
    const [user] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });
    
    // Redirect if no user or invalid role
    React.useEffect(() => {
        if (!user || !user.role || user.role?.toLowerCase() !== 'teacher') {
            navigate('/signup');
            return;
        }

        if (user.onboarding) {
            navigate('/verification-pending');
            return;
        }
    }, [user, navigate]);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Refs to access component data
    const bioRef = useRef();
    const subjectsRef = useRef();
    const availabilityRef = useRef();
    const pricingRef = useRef();
    
    // State for all component data
    const [onboardingData, setOnboardingData] = useState({
        userId: crypto.randomUUID(),
        profilePicture: '',
        governmentIdFront: '',
        governmentIdBack: '',
        degreeLinks: [],
        certificateLinks: [],
        subjects: [],
        availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
        pricingDetails: [{ subject: '', price: 0 }],
        cardDetails: { cardHolder: '', cardNumber: '', expiryDate: '', cvv: '' }
    });

    const updateUserOnboardingStatus = () => {
        const updatedUser = { ...user, onboarding: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Also update the UserContext
        setOnboardingStatus(true);
    };

    const handleFinish = async () => {
        setLoading(true);
        setError('');

        try {
            if (!user?.email) {
                throw new Error('User email is not set. Please sign up again.');
            }

            const formData = {
                ...onboardingData,
                cardDetails: {
                    ...onboardingData.cardDetails,
                    cardNumber: onboardingData.cardDetails.cardNumber.replace(/\s/g, '')
                }
            };

            const response = await AuthService.completeOnboarding(user.email, formData, user.role);
            
            if (response.success) {
                if (response.message === "Teacher profile already exists" || response.user.onboarding === true) {
                    updateUserOnboardingStatus();   
                    navigate('/verification-pending');
                } else {
                    setError('Onboarding completion not confirmed. Please try again.');
                }
            } else if (response.message !== "Teacher profile already exists") {
                throw new Error(response.message || 'Failed to complete onboarding');
            }
        } catch (error) {
            if (error.message !== "Teacher profile already exists") {
                setError(error.message || 'There was an error submitting your information. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        setError('');
        
        try {
            let currentData = {};

            switch (currentStep) {
                case 1:
                    if (bioRef.current?.getData) {
                        currentData = await bioRef.current.getData();
                        setOnboardingData(prev => ({
                            ...prev,
                            profilePicture: currentData.profileImage,
                            governmentIdFront: currentData.governmentIdFront,
                            governmentIdBack: currentData.governmentIdBack,
                            degreeLinks: currentData.degreeLinks || [],
                            certificateLinks: currentData.certificateLinks || [],
                            bio: currentData.bio
                        }));
                    }
                    break;
                case 2:
                    if (subjectsRef.current?.getData) {
                        currentData = await subjectsRef.current.getData();
                        setOnboardingData(prev => ({ ...prev, subjects: currentData }));
                    }
                    break;
                case 3:
                    if (availabilityRef.current?.getData) {
                        currentData = await availabilityRef.current.getData();
                        setOnboardingData(prev => ({ ...prev, availability: currentData }));
                    }
                    break;
                case 4:
                    if (pricingRef.current?.getData) {
                        currentData = await pricingRef.current.getData();
                        setOnboardingData(prev => ({
                            ...prev,
                            pricingDetails: currentData.pricingDetails,
                            cardDetails: currentData.cardDetails
                        }));
                    }
                    break;
            }

            if (isStepValid(onboardingData, currentStep, 'teacher')) {
                if (currentStep === 4) {
                    await handleFinish();
                } else {
                    setCurrentStep(prev => prev + 1);
                }
            } else {
                setError('Please fill in all required fields before proceeding.');
            }
        } catch (error) {
            setError('There was an error processing your information. Please try again.');
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const { title, description } = getStepContent(currentStep, 'teacher');
    
    return (
        <div className="flex items-center justify-center bg-gray-100 py-2 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 min-h-screen">
            <div className="w-[800px] max-w-full mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[500px] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-600 mb-1 sm:mb-2">{title}</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{description}</p>
                    <div className="text-right">
                        <span className="text-xs sm:text-sm text-teal-600 font-medium">Step {currentStep} of 4</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 text-red-500 rounded-md text-xs sm:text-sm flex-shrink-0">
                        {error}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto">
                        <div className="h-full">
                            {currentStep === 1 && (
                                <BioQualifications 
                                    ref={bioRef}
                                    data={onboardingData} 
                                    onChange={setOnboardingData} 
                                />
                            )}
                            {currentStep === 2 && (
                                <Subjects 
                                    ref={subjectsRef}
                                    selectedSubjects={onboardingData.subjects} 
                                    onChange={(subjects) => setOnboardingData(prev => ({ ...prev, subjects }))} 
                                />
                            )}
                            {currentStep === 3 && (
                                <AvailabilitySchedule 
                                    ref={availabilityRef}
                                    slots={onboardingData.availability} 
                                    onChange={(availability) => setOnboardingData(prev => ({ ...prev, availability }))} 
                                />
                            )}
                            {currentStep === 4 && (
                                <PricingDetails 
                                    ref={pricingRef}
                                    pricingDetails={onboardingData.pricingDetails}
                                    cardDetails={onboardingData.cardDetails}
                                    onPricingChange={(pricingDetails) => setOnboardingData(prev => ({ ...prev, pricingDetails }))}
                                    onCardDetailsChange={(cardDetails) => setOnboardingData(prev => ({ ...prev, cardDetails }))}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
                    {currentStep > 1 && (
                        <button
                            onClick={handlePrevious}
                            disabled={loading}
                            className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Previous
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={loading || !isStepValid(onboardingData, currentStep, 'teacher')}
                        className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : currentStep === 4 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
