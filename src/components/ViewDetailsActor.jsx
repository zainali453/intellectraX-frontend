import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, FileText, Calendar, Clock, Users, BookOpen } from 'lucide-react';
import authService from '../services/auth.service';

export default function TeacherDetailsPage({ email, role, handleBack }) {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Mock API service for demonstration


  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // Replace with actual email parameter
        role = role.toLowerCase();
        console.log(email, role);
        const response = await authService.getTeacherProfile(email, role);
        console.log('📥 [ViewDetailsActor] Full API response:', response);
        console.log('📊 [ViewDetailsActor] Response data structure:', response.data);
        console.log('📚 [ViewDetailsActor] Subjects:', response.data?.subjects);
        console.log('⏰ [ViewDetailsActor] Availability:', response.data?.availability);
        
        if (response.success) {
          setTeacherData(response.data);
        } else {
          setError("Failed to fetch teacher profile");
        }
      } catch (err) {
        console.error('❌ [ViewDetailsActor] Error fetching teacher data:', err);
        setError(err.message || "Failed to fetch teacher profile");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-600">No teacher data found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span className="text-lg font-medium">Teacher Details Page</span>
          </button>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Phone size={16} />
            Call
          </button>
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
            <MessageCircle size={16} />
            Message
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
            <FileText size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Teacher Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex gap-6 flex-col">
              <div className="relative w-full">
                <img
                  src={teacherData.profilePicture}
                  alt={teacherData.name}
                  className="w-full aspect-[3/3] rounded-xl object-contain"
                />
                {teacherData.verified === 'verified' && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                    Verified
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{teacherData.name}</h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {teacherData.bio}
                </p>

                {/* Teacher Basic Info */}

              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Availability & Stats */}
        <div className="space-y-6">
          {/* Teacher Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Teacher Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-gray-700">{teacherData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Role:</span>
                <span className="text-gray-700">{teacherData.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Joined:</span>
                <span className="text-gray-700">{formatDate(teacherData.joiningDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Subjects:</span>
                <div className="flex flex-wrap gap-2">
                  {teacherData.subjects && teacherData.subjects.length > 0 ? (
                    teacherData.subjects.map((subject) => (
                      <span
                        key={subject._id || subject.id || Math.random()}
                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm"
                      >
                        {subject.subject || subject.name || 'Unknown Subject'}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No subjects available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Availability
            </h3>
            <div className="space-y-3">
              {teacherData.availability && teacherData.availability.length > 0 ? (
                teacherData.availability.map((slot) => (
                  <div key={slot._id || slot.id || Math.random()} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{slot.day}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm py-2">No availability data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}