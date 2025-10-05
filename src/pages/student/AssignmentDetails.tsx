import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDate } from "@/services/teacher.service";
import { studentService } from "@/services/student.service";
import CustomUpload, { UploadedFile } from "@/components/CustomUpload";

interface AssignmentDetailsType {
  assignmentId: string;
  teacher: string;
  subject: string;
  dueDate: string;
  assignedDate: string;
  description: string;
  title: string;
  attachment: string;
  attachmentUrl: string;
  isMarked: boolean;
  marks: number;
  grade: string;
  teacherComments: string;
  submissionDate: string;
  submissionAttachment: string;
  submissionAttachmentUrl: string;
  studentName: string;
  isSubmitted: boolean;
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

const AssignmentDetails = () => {
  const assignmentId = useParams().id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignmentDetails, setAssignmentDetails] =
    useState<AssignmentDetailsType | null>(null);

  const [imageError, setImageError] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [attachment, setAttachment] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId) return;

      try {
        setLoading(true);

        const response = await studentService.getAssignmentDetails(
          assignmentId
        );
        if (response && response.data) {
          setAssignmentDetails({
            assignmentId: response.data.assignmentId,
            teacher: response.data.teacherName,
            subject: response.data.subject.replace(/^\w/, (c) =>
              c.toUpperCase()
            ),
            dueDate: formatDate(response.data.dueDate),
            assignedDate: formatDate(response.data.createdAt),
            description: response.data.instructions,
            title: response.data.title,
            attachment: extractFileNameFromUrl(response.data.attachment),
            attachmentUrl: response.data.attachment,
            isMarked: response.data.isMarked,
            marks: response.data.marks,
            grade: response.data.grade,
            teacherComments: response.data.teacherComments,
            submissionDate: formatDate(response.data.submissionDate),
            submissionAttachment: extractFileNameFromUrl(
              response.data.submissionAttachment
            ),
            submissionAttachmentUrl: response.data.submissionAttachment,
            studentName: response.data.studentName,
            isSubmitted: response.data.isSubmitted,
          });
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, refreshFlag]);

  const handleAttachmentChange = async (file: File | null) => {
    if (file) {
      try {
        setUploading(true);
        setUploadError("");

        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);

        const response = await studentService.assignmentSubmission(
          formDataToUpload,
          assignmentId || ""
        );

        if (response.success && response.data?.fileUrl) {
          const newAttachment: UploadedFile = {
            file,
            url: response.data.fileUrl,
            fileName: response.data.fileName || file.name,
          };

          setAttachment(newAttachment);
        } else {
          throw new Error(response.message || "Upload failed");
        }
      } catch (error: any) {
        setUploadError(`Failed to upload attachment: ${error.message}`);
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
        setRefreshFlag((prev) => !prev);
      }
    } else {
      setAttachment(null);
    }
  };

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Assignment Details'></CustomDetailHeader>
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : assignmentDetails ? (
        <>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={`/subjects/${assignmentDetails?.subject?.toLowerCase()}.png`}
                  alt={assignmentDetails?.subject}
                  className='w-full h-100 object-cover rounded-xl'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-full h-100 bg-[#4393961a] rounded-xl flex items-center justify-center p-2'>
                  <span className='text-bgprimary font-semibold text-7xl capitalize wrap-anywhere text-center'>
                    {assignmentDetails.subject || "Subject"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className='text-3xl text-textprimary font-semibold mt-6 mb-4'>
                {assignmentDetails.title || "Assignment Title"}
              </h2>
              <p className='text-gray-800 leading-relaxed mb-8'>
                {assignmentDetails.description || "No description available."}
              </p>

              {/* Detail Cards Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <CustomDetailCard
                  icon='studentStar'
                  label='Assigned By'
                  value={assignmentDetails.teacher || "N/A"}
                />
                <CustomDetailCard
                  icon='calender'
                  label='Assigned Date'
                  value={assignmentDetails.assignedDate || "N/A"}
                />
                <CustomDetailCard
                  icon='calender'
                  label='Due Date'
                  value={assignmentDetails.dueDate || "N/A"}
                />
                <CustomDetailCard
                  icon='openBookFilled'
                  label='Subject'
                  value={assignmentDetails.subject || "N/A"}
                />
                <CustomDetailCard
                  icon='attachmentDoc'
                  label='Attachments'
                  className='cursor-pointer'
                  onClick={() => {
                    if (assignmentDetails.attachmentUrl) {
                      window.open(assignmentDetails.attachmentUrl, "_blank");
                    }
                  }}
                  value={assignmentDetails.attachment || "N/A"}
                  tooltip='Click to view attachment'
                  iconClassName='h-[26x] w-[23px]'
                />
              </div>
            </div>
          </div>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div>
              <h2 className='text-2xl text-textprimary font-semibold mb-4'>
                Submission Details
              </h2>

              {assignmentDetails.isSubmitted && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <CustomDetailCard
                    icon='studentStar'
                    label='Submitted By'
                    value={assignmentDetails.studentName || "N/A"}
                  />
                  <CustomDetailCard
                    icon='attachmentDoc'
                    label='Submitted File'
                    className='cursor-pointer'
                    onClick={() => {
                      if (assignmentDetails.submissionAttachmentUrl) {
                        window.open(
                          assignmentDetails.submissionAttachmentUrl,
                          "_blank"
                        );
                      }
                    }}
                    value={assignmentDetails.submissionAttachment || "N/A"}
                    tooltip='Click to view submitted file'
                    iconClassName='h-[26x] w-[23px]'
                  />
                  <CustomDetailCard
                    icon='calender'
                    label='Submission Date'
                    value={assignmentDetails.submissionDate || "N/A"}
                  />
                </div>
              )}
              {assignmentDetails.isMarked && (
                <div className='mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Teacher Comments
                    </label>
                    <textarea
                      value={assignmentDetails.teacherComments || ""}
                      placeholder='Enter assignment instructions...'
                      rows={6}
                      disabled
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                    />
                  </div>
                  <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Grade
                      </label>
                      <input
                        type='text'
                        value={assignmentDetails.grade || ""}
                        placeholder='Grade'
                        disabled
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Marks
                      </label>
                      <input
                        type='text'
                        value={assignmentDetails.marks || ""}
                        placeholder='Marks'
                        disabled
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                      />
                    </div>
                  </div>
                </div>
              )}

              {assignmentDetails.isSubmitted === false && (
                <CustomUpload
                  label='Upload Your Submission'
                  value={attachment}
                  onChange={handleAttachmentChange}
                  acceptedTypes='image/*,.pdf,.doc,.docx'
                  placeholder='Upload Submission File'
                  uploading={uploading}
                  error={uploadError}
                />
              )}

              {assignmentDetails.isMarked === false &&
                assignmentDetails.isSubmitted === true && (
                  <p className='text-gray-500 text-2xl text-center my-10'>
                    This assignment has not been graded yet.
                  </p>
                )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No Assignment details found.</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;
