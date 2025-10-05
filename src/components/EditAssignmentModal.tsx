import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import DatePicker from "./DatePicker";
import LoadingSpinner from "./LoadingSpinner";
import CustomUpload, { UploadedFile } from "./CustomUpload";
import {
  AssignmentData,
  StudentForClass,
  teacherService,
} from "@/services/teacher.service";
import SkeletonDropdown from "./SkeletonDropdown";

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: AssignmentData) => void;
  initialData?: AssignmentData;
  mode: "create" | "edit";
  loading: boolean;
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

const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = "create",
  loading,
}) => {
  const [formData, setFormData] = useState<AssignmentData>({
    subject: "",
    student: "",
    attachment: "",
    title: "",
    instructions: "",
    dueDate: "",
  });

  const [students, setStudents] = useState<StudentForClass[]>([]);
  const [commonSubjects, setCommonSubjects] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [attachment, setAttachment] = useState<UploadedFile | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await teacherService.getStudentsForClass();
        if (response && response.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchCommonSubjects = async () => {
      if (!formData.student) {
        setCommonSubjects([]);
        return;
      }
      try {
        setLoadingSubjects(true);
        const response = await teacherService.getStudentCommonSubjects(
          formData.student
        );
        if (response && response.data) {
          setCommonSubjects(response.data);
        } else {
          setCommonSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching common subjects:", error);
        setCommonSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchCommonSubjects();
  }, [formData.student]);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        // Initialize attachment from existing data
        if (initialData.attachment) {
          setAttachment({
            file: null,
            url: initialData.attachment,
            fileName: extractFileNameFromUrl(initialData.attachment),
          });
        }
      } else {
        setFormData({
          subject: "",
          student: "",
          attachment: "",
          title: "",
          instructions: "",
          dueDate: "",
        });
        setAttachment(null);
      }
      setUploadError("");
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: keyof AssignmentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAttachmentChange = async (file: File | null) => {
    if (file) {
      try {
        setUploading(true);
        setUploadError("");

        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);

        const response = await teacherService.upload(formDataToUpload);

        if (response.success && response.data?.fileUrl) {
          const newAttachment: UploadedFile = {
            file,
            url: response.data.fileUrl,
            fileName: response.data.fileName || file.name,
          };

          setAttachment(newAttachment);
          handleInputChange("attachment", response.data.fileUrl);
        } else {
          throw new Error(response.message || "Upload failed");
        }
      } catch (error: any) {
        setUploadError(`Failed to upload attachment: ${error.message}`);
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    } else {
      setAttachment(null);
      handleInputChange("attachment", "");
    }
  };

  const handleSave = async () => {
    if (!formData.student) {
      alert("Please select a student before saving.");
      return;
    }
    if (!formData.subject) {
      alert("Please select a subject before saving.");
      return;
    }
    if (!formData.dueDate) {
      alert("Please select a due date before saving.");
      return;
    }
    if (!formData.instructions) {
      alert("Please enter instructions before saving.");
      return;
    }
    if (!formData.title) {
      alert("Please enter a title before saving.");
      return;
    }

    onSave(formData);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    if (typeof date === "string") date = new Date(date);
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-[#0000002e] transition-opacity'
        onClick={handleBackdropClick}
      />

      <div className='relative w-full max-w-2xl max-h-[83vh] overflow-y-auto bg-white rounded-lg shadow-xl'>
        {/* Loading Overlay */}
        {loading && (
          <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg'>
            <LoadingSpinner size='lg' color='primary' text='Loading...' />
          </div>
        )}

        {/* Modal Content */}
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-8 top-0 bg-white z-10 pb-4 border-b-2 border-gray-100'>
            <h2 className='text-2xl font-semibold text-textprimary'>
              {mode === "create" ? "Create Assignment" : "Edit Assignment"}
            </h2>
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Student */}
            <div>
              {loadingStudents ? (
                <SkeletonDropdown label='Student' required />
              ) : (
                <CustomDropdown
                  label='Student'
                  placeholder='Select a student'
                  value={formData.student}
                  onChange={(value) => handleInputChange("student", value)}
                  options={students.map((student) => ({
                    value: student.studentId,
                    label: student.fullName,
                  }))}
                  required
                  disabled={mode === "edit"}
                />
              )}
            </div>

            {/* Subject */}
            <div>
              {loadingSubjects ? (
                <SkeletonDropdown label='Subject' required />
              ) : (
                <CustomDropdown
                  label='Subject'
                  placeholder='Select a subject'
                  value={formData.subject}
                  onChange={(value) => handleInputChange("subject", value)}
                  options={commonSubjects.map((subject) => ({
                    value: subject,
                    label: subject.replace(/^\w/, (c) => c.toUpperCase()),
                  }))}
                  required
                  disabled={
                    mode === "edit" ||
                    loadingStudents ||
                    students.length === 0 ||
                    !formData.student
                  }
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Title <span className='text-red-500'>*</span>
              </label>
              <input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder='Enter assignment title...'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent text-sm'
              />
            </div>

            {/* Due Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Due Date <span className='text-red-500'>*</span>
              </label>
              <div className='mb-6'>
                <DatePicker
                  name='dueDate'
                  value={formData.dueDate ? new Date(formData.dueDate) : null}
                  minDate={new Date()}
                  showMonthDropdown={false}
                  showYearDropdown={false}
                  onChange={(value) => handleInputChange("dueDate", value)}
                  placeholder='Select date'
                  className='mb-2'
                />
                <div className='flex items-center gap-3'>
                  <Calendar className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-600'>
                    {formData.dueDate
                      ? formatDate(new Date(formData.dueDate))
                      : "No date selected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Instructions <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  handleInputChange("instructions", e.target.value)
                }
                placeholder='Enter assignment instructions...'
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed'
              />
            </div>

            {/* Attachment Upload */}
            <CustomUpload
              label='Attachment Upload'
              value={attachment}
              onChange={handleAttachmentChange}
              acceptedTypes='image/*,.pdf,.doc,.docx'
              placeholder='Upload assignment attachment'
              uploading={uploading}
              error={uploadError}
            />
          </div>

          <div className='flex flex-col gap-3 mt-6 bg-white pt-4 border-t border-gray-100'>
            <button
              onClick={handleSave}
              disabled={loading || uploading}
              className='w-full bg-bgprimary text-white py-4 px-6 rounded-full font-medium text-base hover:bg-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {uploading ? "Uploading..." : "Save Assignment"}
            </button>
            <button
              onClick={onClose}
              className='w-full bg-white text-gray-700 py-4 px-6 rounded-full font-medium text-base border border-gray-300 hover:bg-gray-50 transition-colors duration-200'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssignmentModal;
