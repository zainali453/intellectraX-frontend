import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useUser } from "@/context/UserContext";
import CustomIcon from "@/components/CustomIcon";
import { onboardingService } from "@/services/onboarding.service";

// Type definitions for better code organization
interface BioQualificationsProps {
  data: BioData;
  onChange: (updater: (prev: any) => any) => void;
}

interface BioData {
  governmentId: string;
  degreeLinks: string[];
  certificateLinks: string[];
  bio: string;
}

interface FileItem {
  id: string;
  file: File | null;
  url: string;
  fileName: string;
  isUploading: boolean;
  isRemoving?: boolean;
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

interface MultipleFileUploadProps {
  label: string;
  fileType: "degreeLinks" | "certificateLinks";
  files: FileItem[];
  onFileAdd: (fileType: "degreeLinks" | "certificateLinks", file: File) => void;
  onFileRemove: (
    fileType: "degreeLinks" | "certificateLinks",
    fileId: string
  ) => Promise<void>;
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

// Generate unique ID for file items
const generateId = () => Math.random().toString(36).substr(2, 9);

const BioQualifications = () => {
  const { updateUserFromCookies } = useUser();

  const data: BioData = {
    governmentId: "",
    degreeLinks: [],
    certificateLinks: [],
    bio: "",
  };
  // State management with cleaner structure
  const [formData, setFormData] = useState({
    bio: data.bio || "",
    governmentId: {
      file: null as File | null,
      url: data.governmentId || "",
      fileName: data.governmentId
        ? extractFileNameFromUrl(data.governmentId)
        : "",
    },
  });

  const [degreeFiles, setDegreeFiles] = useState<FileItem[]>(
    data.degreeLinks.map((link) => ({
      id: generateId(),
      file: null,
      url: link,
      fileName: extractFileNameFromUrl(link),
      isUploading: false,
      isRemoving: false,
    }))
  );
  const [certificateFiles, setCertificateFiles] = useState<FileItem[]>(
    data.certificateLinks.map((link) => ({
      id: generateId(),
      file: null,
      url: link,
      fileName: extractFileNameFromUrl(link),
      isUploading: false,
      isRemoving: false,
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Sync data with parent component
  const syncWithParent = useCallback(() => {
    const bioData: BioData = {
      governmentId: formData.governmentId.url,
      degreeLinks: degreeFiles.map((item) => item.url).filter(Boolean),
      certificateLinks: certificateFiles
        .map((item) => item.url)
        .filter(Boolean),
      bio: formData.bio,
    };

    // onChange((prev: any) => ({
    //   ...prev,
    //   ...bioData,
    // }));
  }, [formData, degreeFiles, certificateFiles]);

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

  // Handle single file uploads (government ID)
  const handleSingleFileUpload = async (
    fileType: "governmentId",
    file: File
  ) => {
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

  // Handle multiple file uploads (degreeLinks, certificateLinks)
  const handleMultipleFileAdd = async (
    fileType: "degreeLinks" | "certificateLinks",
    file: File
  ) => {
    const fileId = generateId();
    const setFiles =
      fileType === "degreeLinks" ? setDegreeFiles : setCertificateFiles;

    try {
      setError("");

      // Add file with uploading state
      setFiles((prev) => [
        ...prev,
        {
          id: fileId,
          file,
          url: "",
          fileName: file.name,
          isUploading: true,
          isRemoving: false,
        },
      ]);

      const result = await uploadFile(file, fileType);

      // Update with uploaded URL
      setFiles((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? {
                ...item,
                url: result.fileUrl,
                fileName: result.fileName || file.name,
                isUploading: false,
                isRemoving: false,
              }
            : item
        )
      );
      setFormData((prev) => ({
        ...prev,
        [fileType]: [
          ...(prev[fileType] || []),
          {
            file,
            url: result.fileUrl,
            fileName: result.fileName || file.name,
          },
        ],
      }));
    } catch (err: any) {
      setError(`Failed to upload ${fileType}: ${err.message}`);
      // Remove failed upload
      setFiles((prev) => prev.filter((item) => item.id !== fileId));
    }
  };

  // Remove file from multiple file list
  const handleMultipleFileRemove = async (
    fileType: "degreeLinks" | "certificateLinks",
    fileId: string
  ) => {
    const setFiles =
      fileType === "degreeLinks" ? setDegreeFiles : setCertificateFiles;
    const files = fileType === "degreeLinks" ? degreeFiles : certificateFiles;

    // Find the file to remove
    const fileToRemove = files.find((item) => item.id === fileId);

    try {
      // Set removing state
      setFiles((prev) =>
        prev.map((item) =>
          item.id === fileId ? { ...item, isRemoving: true } : item
        )
      );

      // Only call remove API if the file has a URL (was successfully uploaded)
      if (fileToRemove?.url) {
        await onboardingService.removeUpload(fileToRemove.url, fileType);
      }

      // Remove from local state
      setFiles((prev) => prev.filter((item) => item.id !== fileId));

      setFormData((prev) => ({
        ...prev,
        [fileType]: prev[fileType]?.filter((item) => item.id !== fileId),
      }));
    } catch (err: any) {
      console.error(`Failed to remove ${fileType}:`, err);
      setError(`Failed to remove file: ${err.message}`);

      // Reset removing state on error
      setFiles((prev) =>
        prev.map((item) =>
          item.id === fileId ? { ...item, isRemoving: false } : item
        )
      );
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

    if (fileType === "governmentId") {
      await handleSingleFileUpload(fileType as "governmentId", file);
    } else if (fileType === "degreeLinks" || fileType === "certificateLinks") {
      await handleMultipleFileAdd(
        fileType as "degreeLinks" | "certificateLinks",
        file
      );
    }
  };

  // Handle drag and drop
  const handleDrop = async (fileType: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (fileType === "governmentId") {
      await handleSingleFileUpload(fileType as "governmentId", file);
    } else if (fileType === "degreeLinks" || fileType === "certificateLinks") {
      await handleMultipleFileAdd(
        fileType as "degreeLinks" | "certificateLinks",
        file
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Single file upload component (for government ID)
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

  // Multiple file upload component (for degrees and certificates)
  const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
    label,
    fileType,
    files,
    onFileAdd,
    onFileRemove,
    uploading,
  }) => {
    return (
      <div className='mb-6'>
        <label className='block text-sm font-medium text-[#8E97A4] mb-1'>
          {label}
        </label>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-teal-500 transition-colors cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && !uploading) {
              onFileAdd(fileType, file);
            }
          }}
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
            {uploading ? "Uploading..." : "Drag & drop or"}
            <button
              className='ml-1 text-bgprimary hover:text-teal-600 font-medium text-base cursor-pointer'
              disabled={uploading}
            >
              Browse
            </button>
          </p>
          <input
            id={`${fileType}-input`}
            type='file'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && !uploading) {
                onFileAdd(fileType, file);
              }
            }}
            accept='image/*,.pdf,.doc,.docx'
            disabled={uploading}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className='mt-3 space-y-2'>
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-1 border-gray-200'
              >
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <span
                      className={`text-lg ${
                        fileItem.isUploading
                          ? "text-yellow-500"
                          : fileItem.isRemoving
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {fileItem.isUploading
                        ? "⏳"
                        : fileItem.isRemoving
                        ? "🗑️"
                        : "✓"}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      {fileItem.fileName}
                    </p>
                    {fileItem.isUploading && (
                      <p className='text-xs text-gray-500'>Uploading...</p>
                    )}
                    {fileItem.isRemoving && (
                      <p className='text-xs text-gray-500'>Removing...</p>
                    )}
                  </div>
                </div>
                {!fileItem.isUploading && !fileItem.isRemoving && (
                  <button
                    onClick={async () => {
                      try {
                        await onFileRemove(fileType, fileItem.id);
                      } catch (error) {
                        console.error("Error removing file:", error);
                      }
                    }}
                    className='text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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

      {/* Bio Section */}
      <div className='mb-6'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[#8E97A4] mb-1'>
            Experience & Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={handleBioChange}
            placeholder='Write Teaching Bio...'
            className='w-full px-3 py-2 border placeholder:text-[#8E97A4] border-gray-300 rounded-md focus:outline-none focus:border-1 focus:border-bgprimary resize-none'
            rows={4}
          />
        </div>
      </div>

      {/* Government ID Section */}
      <FileUploadArea
        fileType='governmentId'
        label='Upload Government Issued ID'
        file={formData.governmentId.file}
        fileUrl={formData.governmentId.url}
        fileName={formData.governmentId.fileName}
        onFileUpload={handleFileUpload}
        onFileDrop={handleDrop}
        uploading={uploading}
      />

      {/* Degrees Section - Multiple Files */}
      <MultipleFileUpload
        label='Upload Degrees'
        fileType='degreeLinks'
        files={degreeFiles}
        onFileAdd={handleMultipleFileAdd}
        onFileRemove={handleMultipleFileRemove}
        uploading={uploading}
      />

      {/* Certificates Section - Multiple Files */}
      <MultipleFileUpload
        label='Upload Certificates'
        fileType='certificateLinks'
        files={certificateFiles}
        onFileAdd={handleMultipleFileAdd}
        onFileRemove={handleMultipleFileRemove}
        uploading={uploading}
      />
    </div>
  );
};

export default BioQualifications;
