import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Upload, User, Plus } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const BioQualifications = forwardRef((props, ref) => {
  const { user } = useUser();
  const email = props.email || user?.email;
  const role = props.role || user?.role;
  const [bio, setBio] = useState(props?.bio || '');
  const [governmentId, setGovernmentId] = useState(null);
  const [degrees, setDegrees] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Store S3 URLs
  const [governmentIdUrl, setGovernmentIdUrl] = useState('');
  const [degreesUrl, setDegreesUrl] = useState('');
  const [certificatesUrl, setCertificatesUrl] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');

  // Set initial URLs from qualifications prop
  useEffect(() => {
    if (props.qualifications && Array.isArray(props.qualifications)) {
      const degree = props.qualifications.find(q => q.type === 'degree');
      const certificate = props.qualifications.find(q => q.type === 'certificate');
      if (degree && degree.fileUrl) setDegreesUrl(degree.fileUrl);
      if (certificate && certificate.fileUrl) setCertificatesUrl(certificate.fileUrl);
    }
  }, [props.qualifications]);

  // Function to send all current data to parent
  const sendAllDataToParent = () => {
    const allData = {
      profileImage: profilePicUrl,
      governmentIdFront: governmentIdUrl,
      governmentIdBack: '',
      degreeLinks: degreesUrl ? [degreesUrl] : [],
      certificateLinks: certificatesUrl ? [certificatesUrl] : [],
      bio: bio
    };
    if (props.onChange) {
      props.onChange(prev => ({
        ...prev,
        ...allData
      }));
    }
  };

  useImperativeHandle(ref, () => ({
    getData: async () => {
      return {
        profileImage: profilePicUrl,
        governmentIdFront: governmentIdUrl,
        governmentIdBack: '',
        degreeLinks: degreesUrl ? [degreesUrl] : [],
        certificateLinks: certificatesUrl ? [certificatesUrl] : [],
        bio: bio
      };
    }
  }));

  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
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

  const handleFileUpload = async (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploading(true);
        setError('');
        const result = await uploadFile(file, fileType);
        switch (fileType) {
          case 'profilePic':
            setProfilePic(URL.createObjectURL(file));
            setProfilePicUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, profilePicture: result.fileUrl }));
            }
            break;
          case 'governmentId':
            setGovernmentId(file);
            setGovernmentIdUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, governmentIdFront: result.fileUrl }));
            }
            break;
          case 'degrees':
            setDegrees(file);
            setDegreesUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, degreeLinks: [result.fileUrl] }));
            }
            break;
          case 'certificates':
            setCertificates(file);
            setCertificatesUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, certificateLinks: [result.fileUrl] }));
            }
            break;
        }
        sendAllDataToParent();
      } catch (err) {
        setError(`Failed to upload ${fileType}: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleBioChange = (e) => {
    const newBio = e.target.value;
    setBio(newBio);
    setTimeout(() => { sendAllDataToParent(); }, 0);
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = async (fileType, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        setUploading(true);
        setError('');
        const result = await uploadFile(file, fileType);
        switch (fileType) {
          case 'profilePic':
            setProfilePic(URL.createObjectURL(file));
            setProfilePicUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, profilePicture: result.fileUrl }));
            }
            break;
          case 'governmentId':
            setGovernmentId(file);
            setGovernmentIdUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, governmentIdFront: result.fileUrl }));
            }
            break;
          case 'degrees':
            setDegrees(file);
            setDegreesUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, degreeLinks: [result.fileUrl] }));
            }
            break;
          case 'certificates':
            setCertificates(file);
            setCertificatesUrl(result.fileUrl);
            if (props.onChange) {
              props.onChange(prev => ({ ...prev, certificateLinks: [result.fileUrl] }));
            }
            break;
        }
        sendAllDataToParent();
      } catch (err) {
        setError(`Failed to upload ${fileType}: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const FileUploadArea = ({ fileType, label, file, fileUrl }) => {
    const getFileName = (url) => {
      try {
        return decodeURIComponent(url.split('/').pop().split('?')[0]);
      } catch {
        return 'Document';
      }
    };
    const hasFile = !!file || !!fileUrl;
    const fileName = file ? file.name : fileUrl ? getFileName(fileUrl) : '';
    const isProfilePic = fileType === 'profilePic';
    
    if (isProfilePic) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <div className="flex items-center justify-center">
            <div className="relative cursor-pointer" onClick={() => !uploading && document.getElementById(`${fileType}-input`).click()}>
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {hasFile ? (
                  <img 
                    src={file || fileUrl} 
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
                id={`${fileType}-input`}
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(fileType, e)}
                accept="image/*"
                disabled={uploading}
              />
            </div>
          </div>
          {uploading && (
            <p className="text-sm text-gray-600 text-center mt-2">Uploading...</p>
          )}
        </div>
      );
    }
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-teal-500 transition-colors cursor-pointer ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          } ${hasFile ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDrop={(e) => !uploading && handleDrop(fileType, e)}
          onClick={() => !uploading && document.getElementById(`${fileType}-input`).click()}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {uploading
              ? 'Uploading...'
              : hasFile
                ? <span className="flex items-center justify-center gap-2 text-teal-700 font-medium"><span className="text-lg">✓</span> {fileName}</span>
                : 'Drag & drop or'}
          </p>
          <button 
            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            disabled={uploading}
          >
            {hasFile ? 'Change File' : 'Browse'}
          </button>
          <input
            id={`${fileType}-input`}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(fileType, e)}
            accept={fileType === 'profilePic' ? "image/*" : "image/*,.pdf,.doc,.docx"}
            disabled={uploading}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Profile Picture Section */}
      {!props.qualifications && (
        <FileUploadArea
          fileType="profilePic"
          label="Profile Picture"
          file={profilePic}
          fileUrl={profilePicUrl}
        />
      )}
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience & Bio
          </label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="Write Teaching Bio..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            rows="3"
          />
        </div>
      </div>
      <FileUploadArea
        fileType="governmentId"
        label="Upload Government Issued ID"
        file={governmentId}
        fileUrl={governmentIdUrl}
      />
      <FileUploadArea
        fileType="degrees"
        label="Upload Degrees"
        file={degrees}
        fileUrl={degreesUrl}
      />
      <FileUploadArea
        fileType="certificates"
        label="Upload Certificates"
        file={certificates}
        fileUrl={certificatesUrl}
      />
    </div>
  );
});

export default BioQualifications;