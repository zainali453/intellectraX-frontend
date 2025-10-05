import React from "react";
import CustomIcon from "./CustomIcon";

export interface UploadedFile {
  file: File | null;
  url: string;
  fileName: string;
}

interface CustomUploadProps {
  label?: string;
  value?: UploadedFile | null;
  onChange: (file: File | null) => void;
  acceptedTypes?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  uploading?: boolean;
  error?: string;
  showPreview?: boolean;
  maxFileSize?: number; // in MB
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  label,
  value,
  onChange,
  acceptedTypes = "image/*,.pdf,.doc,.docx",
  placeholder = "Drag & drop or browse to upload",
  required = false,
  disabled = false,
  uploading = false,
  error,
  showPreview = true,
  maxFileSize = 10, // 10MB default
}) => {
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const hasFile = value && (value.file || value.url);
  const fileName = value?.file?.name || value?.fileName || "";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || uploading) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const validateAndSetFile = (file: File) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    // Check file type if acceptedTypes is specified
    if (acceptedTypes && acceptedTypes !== "*") {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const mimeType = file.type;
      const acceptedArray = acceptedTypes.split(",").map((type) => type.trim());

      const isValidType = acceptedArray.some((accepted) => {
        if (accepted.startsWith(".")) {
          return fileExtension === accepted;
        }
        if (accepted.includes("*")) {
          const baseType = accepted.split("/")[0];
          return mimeType.startsWith(baseType);
        }
        return mimeType === accepted;
      });

      if (!isValidType) {
        alert(`File type not supported. Accepted types: ${acceptedTypes}`);
        return;
      }
    }

    onChange(file);
  };

  const handleRemoveFile = () => {
    if (!disabled && !uploading) {
      onChange(null);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      document.getElementById(inputId)?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (fileName: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const extension = `.${fileName.split(".").pop()?.toLowerCase()}`;
    return imageExtensions.includes(extension);
  };

  return (
    <div className='w-full'>
      {/* Label */}
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${
            disabled || uploading
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "hover:border-teal-500 hover:bg-teal-50"
          }
          ${hasFile ? "border-teal-500 bg-teal-50" : "border-gray-300 bg-white"}
          ${error ? "border-red-500 bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          id={inputId}
          type='file'
          className='hidden'
          onChange={handleFileSelect}
          accept={acceptedTypes}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className='flex flex-col items-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2'></div>
            <p className='text-sm text-gray-600'>Uploading...</p>
          </div>
        ) : hasFile ? (
          <div className='space-y-3'>
            {/* File Preview */}
            {showPreview && value?.url && isImage(fileName) && (
              <div className='flex justify-center'>
                <img
                  src={value.url}
                  alt='Preview'
                  className='max-h-32 max-w-full rounded-lg object-cover'
                />
              </div>
            )}

            {/* File Info */}
            <div className='flex items-center justify-center gap-2 text-teal-600'>
              <CustomIcon name='upload' className='h-5 w-6' />
              <span className='font-medium text-sm'>{fileName}</span>
              {value?.file && (
                <span className='text-xs text-gray-500'>
                  ({formatFileSize(value.file.size)})
                </span>
              )}
            </div>

            {/* Actions */}
            <div className='flex items-center justify-center gap-4 text-sm'>
              <button
                type='button'
                className='text-teal-600 hover:text-teal-700 font-medium'
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Change File
              </button>
              <button
                type='button'
                className='text-red-600 hover:text-red-700 font-medium'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            <CustomIcon
              name='upload'
              className='mx-auto mt-2 h-9 w-10 text-gray-400 mb-2'
            />
            <p className='text-base text-textprimary mb-1'>
              {uploading ? (
                "Uploading..."
              ) : hasFile ? (
                <span className='flex items-center justify-center gap-2 text-bgprimary font-medium'>
                  <span className='text-lg'>✓</span> {fileName}
                </span>
              ) : (
                "Drag & drop or"
              )}
              <button
                className='ml-1 text-bgprimary hover:text-teal-600 font-medium text-base cursor-pointer'
                disabled={uploading}
              >
                {hasFile ? "Change File" : "Browse"}
              </button>
            </p>
            <p className='text-xs text-gray-500'>
              {acceptedTypes !== "*" && (
                <span className='block'>Supported: {acceptedTypes}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default CustomUpload;
