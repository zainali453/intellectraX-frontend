import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import CustomIcon from "../../components/CustomIcon";
import { onboardingService } from "../../services/onboarding.service";
import ConfirmRemoveChildModal from "./ConfirmRemoveChildModal";

// Type definitions for better code organization
interface BioQualificationsProps {
  data: BioData;
  onChange: (updater: (prev: any) => any) => void;
}

interface BioData {
  profilePic: string;
  bio: string;
  childs: {
    email: string;
    fullName: string;
  }[];
}

interface UploadResult {
  success: boolean;
  fileUrl: string;
  fileKey: string;
  fileName?: string;
  originalName?: string;
}

interface FileUploadAreaProps {
  fileType: string;
  label?: string;
  file: File | string | null;
  fileUrl: string;
  fileName?: string;
  onFileUpload: (
    fileType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFileDrop: (fileType: string, event: React.DragEvent) => void;
  uploading: boolean;
}

// Extract filename from URL
const extractFileNameFromUrl = (url: string): string => {
  try {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 2];
    return fileName;
  } catch {
    return "Document";
  }
};

const PersonalInformation = ({ data, onChange }: BioQualificationsProps) => {
  const { updateUserFromCookies } = useUser();

  // State management with cleaner structure
  const [formData, setFormData] = useState({
    bio: data.bio || "",
    profilePic: {
      file: null as File | null,
      url: data.profilePic || "",
      fileName: data.profilePic ? extractFileNameFromUrl(data.profilePic) : "",
    },
    childs: data.childs || [],
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    childEmail: string;
    childName: string;
  }>({
    isOpen: false,
    childEmail: "",
    childName: "",
  });

  // Sync data with parent component
  const syncWithParent = useCallback(() => {
    const bioData: BioData = {
      profilePic: formData.profilePic.url,
      bio: formData.bio,
      childs: data.childs,
    };

    onChange((prev: any) => ({
      ...prev,
      ...bioData,
    }));
  }, [formData, onChange]);

  // Auto-sync when data changes
  useEffect(() => {
    syncWithParent();
  }, [formData]);

  // Upload file to server
  const uploadFile = async (
    file: File,
    type: string
  ): Promise<UploadResult> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await onboardingService.upload(formData, type);
      if (!response.success || !response.data?.fileUrl) {
        throw new Error(response.message || "Upload failed");
      }
      if (type === "profilePic") updateUserFromCookies();
      return {
        success: true,
        fileUrl: response.data.fileUrl,
        fileKey: response.data.fileKey,
        fileName: response.data.fileName || file.name,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle single file uploads (profile pic)
  const handleSingleFileUpload = async (fileType: "profilePic", file: File) => {
    try {
      setUploading(true);
      setError("");

      const result = await uploadFile(file, fileType);

      setFormData((prev) => ({
        ...prev,
        [fileType]: {
          file,
          url: result.fileUrl,
          fileName: result.fileName || file.name,
        },
      }));
    } catch (err: any) {
      setError(`Failed to upload ${fileType}: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle bio text changes
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setFormData((prev) => ({ ...prev, bio: newBio }));
  };

  // Handle file upload events
  const handleFileUpload = async (
    fileType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileType === "profilePic") {
      await handleSingleFileUpload(fileType as "profilePic", file);
    }
  };

  // Handle drag and drop
  const handleDrop = async (fileType: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (fileType === "profilePic") {
      await handleSingleFileUpload(fileType as "profilePic", file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle remove child
  const handleRemoveChild = (email: string, name: string) => {
    setRemoveModal({
      isOpen: true,
      childEmail: email,
      childName: name,
    });
  };

  const confirmRemoveChild = () => {
    const updatedChilds = data.childs.filter(
      (child) => child.email !== removeModal.childEmail
    );

    onChange((prev: any) => ({
      ...prev,
      childs: updatedChilds,
    }));

    setRemoveModal({
      isOpen: false,
      childEmail: "",
      childName: "",
    });
  };

  const cancelRemoveChild = () => {
    setRemoveModal({
      isOpen: false,
      childEmail: "",
      childName: "",
    });
  };

  // Single file upload component (for profile pic)
  const FileUploadArea: React.FC<FileUploadAreaProps> = ({
    fileType,
    label,
    file,
    fileUrl,
    fileName: storedFileName,
    onFileUpload,
    onFileDrop,
    uploading,
  }) => {
    const getFileName = (url: string): string => {
      try {
        return decodeURIComponent(url.split("/").pop()!.split("?")[0]);
      } catch {
        return "Document";
      }
    };

    const hasFile = !!file || !!fileUrl;
    const fileName =
      file instanceof File
        ? file.name
        : storedFileName || (fileUrl ? getFileName(fileUrl) : "");
    const isProfilePic = fileType === "profilePic";

    if (isProfilePic) {
      return (
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
          </label>
          <div className='flex items-center justify-center'>
            <div
              className='relative cursor-pointer'
              onClick={() => {
                if (!uploading) {
                  document.getElementById(`${fileType}-input`)?.click();
                }
              }}
            >
              <div className='w-32 h-32 bg-[#EFF2F7] rounded-full flex items-center justify-center overflow-hidden'>
                {hasFile ? (
                  <img
                    src={typeof file === "string" ? file : fileUrl}
                    alt='Profile'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <CustomIcon name='user' className='w-22 h-22' />
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-12 h-15 rounded-full flex items-center justify-center transition-colors ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CustomIcon name='camera' />
              </div>
              <input
                id={`${fileType}-input`}
                type='file'
                className='hidden'
                onChange={(e) => onFileUpload(fileType, e)}
                accept='image/*'
                disabled={uploading}
              />
            </div>
          </div>
          {uploading && (
            <p className='text-sm text-gray-600 text-center mt-2'>
              Uploading...
            </p>
          )}
        </div>
      );
    }

    return (
      <div className='mb-6'>
        <label className='block text-sm font-medium text-[#8E97A4] mb-1'>
          {label}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-teal-500 transition-colors cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          } ${hasFile ? "border-teal-500 bg-teal-50" : "border-gray-300"}`}
          onDragOver={handleDragOver}
          onDrop={(e) => !uploading && onFileDrop(fileType, e)}
          onClick={() => {
            if (!uploading) {
              document.getElementById(`${fileType}-input`)?.click();
            }
          }}
        >
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
          <input
            id={`${fileType}-input`}
            type='file'
            className='hidden'
            onChange={(e) => onFileUpload(fileType, e)}
            accept={
              fileType === "profilePic" ? "image/*" : "image/*,.pdf,.doc,.docx"
            }
            disabled={uploading}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {error && (
        <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm'>
          {error}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className='my-10'>
        <FileUploadArea
          fileType='profilePic'
          file={formData.profilePic.file}
          fileUrl={formData.profilePic.url}
          fileName={formData.profilePic.fileName}
          onFileUpload={handleFileUpload}
          onFileDrop={handleDrop}
          uploading={uploading}
        />
      </div>

      {/* Bio Section */}
      <div className='mb-6'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[#8E97A4] mb-1'>
            About You
          </label>
          <textarea
            value={formData.bio}
            onChange={handleBioChange}
            placeholder='Write about yourself...'
            className='w-full px-3 py-2 border placeholder:text-[#8E97A4] border-gray-300 rounded-md focus:outline-none focus:border-1 focus:border-bgprimary resize-none'
            rows={4}
          />
        </div>
      </div>

      {/* Children List Section */}
      {data.childs && data.childs.length > 0 ? (
        <div className='mb-6'>
          <label className='block text-sm font-medium text-[#8E97A4] mb-3'>
            Your Children
          </label>
          <div className='space-y-3'>
            {data.childs.map((child, index) => (
              <div
                key={child.email}
                className='flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex items-center gap-3'>
                  {/* Profile Picture Placeholder */}
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'>
                    <CustomIcon name='user' className='w-8 h-8 text-gray-400' />
                  </div>

                  {/* Child Info */}
                  <div className='flex flex-col'>
                    <h3 className='text-base font-semibold text-gray-900'>
                      {child.fullName || "Child Name"}
                    </h3>
                    <p className='text-sm text-gray-500'>{child.email}</p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() =>
                    handleRemoveChild(child.email, child.fullName || "Child")
                  }
                  className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                  title='Remove child'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Info Message */}
          <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-xs text-blue-800'>
              💡 <strong>Note:</strong> Removing a child from your account is
              permanent. They will need to re-add your email to reconnect.
            </p>
          </div>
        </div>
      ) : (
        <div className='mb-2 flex flex-col items-center justify-center'>
          <p className='text-2xl mb-2 text-gray-500 '>No children added yet.</p>
          <p className='text-md text-gray-500'>
            Please add your email address to your child's account to connect
            them.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmRemoveChildModal
        isOpen={removeModal.isOpen}
        childName={removeModal.childName}
        childEmail={removeModal.childEmail}
        onConfirm={confirmRemoveChild}
        onCancel={cancelRemoveChild}
      />
    </div>
  );
};

export default PersonalInformation;
