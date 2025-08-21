import React, { useState, useRef } from "react";
import { Upload, User, Plus } from "lucide-react";

const FileUploadArea = ({
  value, // URL string or null
  onChange, // (url: string) => void
  uploadFile, // async (file) => url
  accept = "image/*,.pdf,.doc,.docx",
  label = "Upload File",
  displayType = "file", // 'image' or 'file'
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (uploadFile) {
      setUploading(true);
      try {
        const url = await uploadFile(file);
        onChange(url);
      } catch (err) {
        // Optionally handle error
      }
      setUploading(false);
    } else {
      // If no uploadFile provided, just return file object (for preview)
      onChange(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (uploading) return;
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (uploadFile) {
      setUploading(true);
      try {
        const url = await uploadFile(file);
        onChange(url);
      } catch (err) {
        // Optionally handle error
      }
      setUploading(false);
    } else {
      onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Helper to get file name from URL
  const getFileName = (url) => {
    try {
      return decodeURIComponent(url.split("/").pop().split("?")[0]);
    } catch {
      return "Document";
    }
  };

  // Display logic
  if (displayType === "image") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex items-center justify-center">
          <div
            className={`relative cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              !uploading && inputRef.current && inputRef.current.click()
            }
          >
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {value ? (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
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

  // Generic file display
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-teal-500 transition-colors cursor-pointer ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        } ${value ? "border-teal-500 bg-teal-50" : "border-gray-300"}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() =>
          !uploading && inputRef.current && inputRef.current.click()
        }
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          {uploading ? (
            "Uploading..."
          ) : value ? (
            <span className="flex items-center justify-center gap-2 text-bgprimary font-medium">
              <span className="text-lg">✓</span> {getFileName(value)}
            </span>
          ) : (
            "Drag & drop or"
          )}
        </p>
        <button
          className="text-teal-600 hover:text-bgprimary font-medium text-sm"
          disabled={uploading}
        >
          {value ? "Change File" : "Browse"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default FileUploadArea;
