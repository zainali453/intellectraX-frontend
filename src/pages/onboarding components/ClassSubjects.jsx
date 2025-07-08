import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { User, Plus } from 'lucide-react';
import Subjects from './Subjects';

const ClassSubjects = forwardRef(({ 
  data = {},
  onChange 
}, ref) => {
  const [profileImage, setProfileImage] = useState(data.profilePicture || null);
  const [profileImageUrl, setProfileImageUrl] = useState(data.profilePicture || '');
  const [className, setClassName] = useState(data.className || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const subjectsRef = useRef();

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    getData: async () => {
      const subjectsData = await subjectsRef.current?.getData() || [];
      return {
        profileImage: profileImageUrl,
        className: className,
        subjects: subjectsData
      };
    }
  }));

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profilePic');
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      if (!token) throw new Error('No authentication token found. Please log in again.');
      const response = await fetch('http://localhost:3000/api/user/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      if (data.success) {
        return { success: true, fileUrl: data.fileUrl, fileKey: data.fileKey };
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploading(true);
        setError('');
        const result = await uploadFile(file);
        setProfileImage(URL.createObjectURL(file));
        setProfileImageUrl(result.fileUrl);
        
        // Notify parent component
        if (onChange) {
          onChange(prev => ({
            ...prev,
            profilePicture: result.fileUrl
          }));
        }
      } catch (err) {
        setError(`Failed to upload image: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setClassName(newClass);
    
    // Notify parent component
    if (onChange) {
      onChange(prev => ({
        ...prev,
        className: newClass
      }));
    }
  };

  const handleSubjectsChange = (subjects) => {
    // Notify parent component
    if (onChange) {
      onChange(prev => ({
        ...prev,
        subjects: subjects
      }));
    }
  };

  const hasImage = !!profileImage || !!profileImageUrl;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Profile Image Upload Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
        <div className="flex items-center justify-center">
          <div className="relative cursor-pointer" onClick={() => !uploading && document.getElementById('profile-image-input').click()}>
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {hasImage ? (
                <img 
                  src={profileImage || profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
              <Plus className="w-5 h-5 text-white" />
            </div>
            <input
              id="profile-image-input"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              disabled={uploading}
            />
          </div>
        </div>
        {uploading && (
          <p className="text-sm text-gray-600 text-center mt-2">Uploading...</p>
        )}
      </div>

      {/* Class Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Class
        </label>
        <input
          type="text"
          value={className}
          onChange={handleClassChange}
          placeholder="Enter your class (e.g., Grade 10, Class 12, etc.)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* Subjects Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Subjects
        </label>
        <Subjects 
          selectedSubjects={data.subjects || []}
          onChange={handleSubjectsChange}
          ref={subjectsRef}
        />
      </div>
    </div>
  );
});

export default ClassSubjects; 