import React from 'react';
import FileUploadArea from '../../components/FileUploadArea';

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'parentDoc');
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
      return data.fileUrl;
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    throw error;
  }
};

const ParentsInformation = ({ fileUrl, about, created, extraField, onChange }) => {
  return (
    <div className="space-y-6">
      {/* File Upload */}
      <FileUploadArea
        value={fileUrl}
        onChange={url => onChange({ fileUrl: url })}
        uploadFile={uploadFile}
        label=""
        displayType="image"
        accept="image/*"
      />

      {/* About Yourself */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about yourself</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
          rows={3}
          value={about}
          onChange={e => onChange({ about: e.target.value })}
          placeholder="Write something about yourself..."
        />
      </div>

      {/* Radio Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Have you already created?</label>
        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="created"
              value="already_created"
              checked={created === 'already_created'}
              onChange={() => onChange({ created: 'already_created' })}
              className="form-radio text-teal-600"
            />
            Already created
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="created"
              value="not_created"
              checked={created === 'not_created'}
              onChange={() => onChange({ created: 'not_created' })}
              className="form-radio text-teal-600"
            />
            Not created
          </label>
        </div>
      </div>

      {/* Conditional Extra Field */}
      {created === 'already_created' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={extraField}
            onChange={e => onChange({ extraField: e.target.value })}
            placeholder="Enter student email..."
          />
        </div>
      )}
    </div>
  );
};

export default ParentsInformation;
