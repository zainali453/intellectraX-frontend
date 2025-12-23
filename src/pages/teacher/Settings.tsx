import CustomIcon, { IconName } from "@/components/CustomIcon";
import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useUser } from "@/context/UserContext";
import { onboardingService } from "@/services/onboarding.service";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Account from "./settings/Account";
import BioQualifications from "./settings/Bio";
import AvailabilitySchedule from "./settings/Availability";
import BankDetails from "./settings/BankDetails";
// import ClassSubject from "./settings/Subjects";
import Support from "./settings/Support";

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
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
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
          <p className='text-sm text-gray-600 text-center mt-2'>Uploading...</p>
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

const profileLinks: {
  name: string;
  icon: IconName;
  path: string;
  size?: string;
}[] = [
  {
    name: "Account",
    icon: "account",
    path: "account",
    size: "w-[19px] h-5",
  },
  {
    name: "Bio & Qualifications",
    icon: "bio",
    path: "bio",
    size: "w-[21px] h-5",
  },
  // {
  //   name: "Subjects",
  //   icon: "classes",
  //   path: "subjects",
  //   size: "w-[20px] h-[19px]",
  // },
  {
    name: "Availability Schedule",
    icon: "availability",
    path: "availability",
    size: "w-[19px] h-5",
  },
  {
    name: "Bank Details",
    icon: "earnings",
    path: "bank",
    size: "w-[11px] h-5",
  },
  {
    name: "Support",
    icon: "supportTickets",
    path: "support",
    size: "w-[16px] h-[19px]",
  },
];

const Settings = () => {
  const { updateUserFromCookies, user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get activePath from URL params or default to "account"
  const [activePath, setActivePathState] = useState<string>(
    searchParams.get("tab") || "account"
  );

  // Update URL when activePath changes
  const setActivePath = (path: string) => {
    setActivePathState(path);
    setSearchParams({ tab: path });
  };

  // Update activePath from URL if tab parameter changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActivePathState(tabParam);
    }
  }, [searchParams]);
  const [data, setData] = useState<{
    profilePic: string;
  }>({
    profilePic: user?.profilePic || "",
  });
  const [formData, setFormData] = useState({
    profilePic: {
      file: null as File | null,
      url: data.profilePic || "",
      fileName: data.profilePic ? extractFileNameFromUrl(data.profilePic) : "",
    },
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader title='Settings' />
      <div className='flex flex-row justify-between gap-8'>
        <div className='bg-white rounded-2xl min-w-1/4'>
          <div className='flex-1 overflow-y-auto scroll-optimized'>
            <div className='my-2 px-6 pt-6'>
              <FileUploadArea
                fileType='profilePic'
                file={formData.profilePic.file}
                fileUrl={formData.profilePic.url}
                fileName={formData.profilePic.fileName}
                onFileUpload={handleFileUpload}
                onFileDrop={handleDrop}
                uploading={uploading}
              />
              <p className='text-center text-xl font-semibold text-textprimary pb-3'>
                {user?.fullName}
              </p>
            </div>
            <div className='border-1 border-[#EAEAEA]'></div>
            <nav className='space-y-6 p-6'>
              {profileLinks.map((link) => {
                const isActive = activePath === link.path.toLowerCase();
                return (
                  <div
                    key={link.name}
                    onClick={() => setActivePath(link.path)}
                    className={`group flex items-center gap-4 px-2 rounded-lg cursor-pointer transition-colors duration-150 ease-out ${
                      isActive
                        ? "text-bgprimary font-medium"
                        : "text-[#ADB4D2] hover:text-bgprimary font-normal"
                    }`}
                  >
                    <CustomIcon
                      name={
                        isActive
                          ? ((link.icon + "Active") as IconName)
                          : link.icon
                      }
                      className={`${link.size || "w-5 h-5"} ${
                        !isActive ? "group-hover:hidden" : ""
                      }`}
                    />
                    {!isActive && (
                      <CustomIcon
                        name={(link.icon + "Active") as any}
                        className={`${
                          link.size || "w-5 h-5"
                        } hidden group-hover:block`}
                      />
                    )}
                    <span>{link.name}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl flex-1'>
          {activePath === "account" && <Account />}
          {activePath === "bio" && (
            <div>
              <label className='text-2xl font-semibold text-textprimary mb-4 block'>
                Bio & Qualifications
              </label>
              <BioQualifications />
            </div>
          )}
          {activePath === "availability" && (
            <div>
              <label className='text-2xl font-semibold text-textprimary mb-4 block'>
                Availability Schedule
              </label>
              <AvailabilitySchedule />
            </div>
          )}
          {activePath === "bank" && (
            <div>
              <label className='text-2xl font-semibold text-textprimary mb-4 block'>
                Bank Details
              </label>
              <BankDetails />
            </div>
          )}
          {activePath === "support" && (
            <div>
              <label className='text-2xl font-semibold text-textprimary mb-4 block'>
                Support
              </label>
              <Support />
            </div>
          )}
          {/* {activePath === "subjects" && (
            <div>
              <label className='text-2xl font-semibold text-textprimary mb-4 block'>
                Subjects
              </label>
              <ClassSubject />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
