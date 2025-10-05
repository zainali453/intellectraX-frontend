import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  teacherService,
  formatDate,
  formatDisplayTime,
  ClassData,
  getOriginalDateUTC,
  getOriginalTimeUTC,
  AssignmentData,
} from "@/services/teacher.service";
import EditAssignmentModal from "@/components/EditAssignmentModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface AssignmentDetailsType {
  assignmentId: string;
  student: string;
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
  isSubmitted: boolean;
}

// 90–100% – A*
// 80–89% – A
// 70–79% – B
// 60–69% – C
// 50–59% – D
// 40–49% – E
// Below 40% – U

const gradeFromMarks = (marks: number): string => {
  if (marks >= 90) return "A*";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  if (marks >= 40) return "E";
  return "U";
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

const AssignmentDetails = () => {
  const assignmentId = useParams().id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignmentDetails, setAssignmentDetails] =
    useState<AssignmentDetailsType | null>(null);

  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId) return;

      try {
        setLoading(true);

        const response = await teacherService.getAssignmentDetails(
          assignmentId
        );
        if (response && response.data) {
          setAssignmentDetails({
            assignmentId: response.data.assignmentId,
            student: response.data.studentName,
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
            submissionDate: response.data.submissionDate
              ? formatDate(response.data.submissionDate)
              : null,
            submissionAttachment: extractFileNameFromUrl(
              response.data.submissionAttachment
            ),
            submissionAttachmentUrl: response.data.submissionAttachment,
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

  const handleSubmissionDetailsChange = (
    field: keyof AssignmentDetailsType,
    value: any
  ) => {
    if (assignmentDetails) {
      setAssignmentDetails({
        ...assignmentDetails,
        [field]: value,
      });
    }
  };

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateAssignment = async (assignmentData: AssignmentData) => {
    setIsModalOpen(true);
    try {
      setLoadingModal(true);
      const response = await teacherService.updateAssignment(
        assignmentId || "",
        assignmentData
      );
      if (response && response.success) {
        closeModal();
        setRefreshFlag((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert(error);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteAssignment = async () => {
    setIsDeleting(true);
    try {
      const response = await teacherService.deleteAssignment(
        assignmentId || ""
      );
      if (response && response.success) {
        setIsDeleting(false);
        navigate("/teacher/assignments");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitGrade = async () => {
    if (!assignmentDetails) return;
    try {
      setLoading(true);
      const response = await teacherService.submitAssignmentGrade(
        assignmentId || "",
        {
          marks: assignmentDetails.marks,
          teacherComments: assignmentDetails.teacherComments,
        }
      );
      if (response && response.success) {
        setRefreshFlag((prev) => !prev);
      }
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Assignment Details'>
        <div className='flex flex-row gap-4'>
          <button
            className='bg-[#FF534F] text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => setShowDelete(true)}
            disabled={assignmentDetails?.isSubmitted}
          >
            Delete
          </button>
          <button
            className='bg-bgprimary text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={openEditModal}
            disabled={assignmentDetails?.isSubmitted}
          >
            Edit
          </button>
        </div>
      </CustomDetailHeader>
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
                  label='Assigned To'
                  value={assignmentDetails.student || "N/A"}
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
                    value={assignmentDetails.student || "N/A"}
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
              {assignmentDetails.isSubmitted && (
                <div className='mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Teacher Comments
                    </label>
                    <textarea
                      value={assignmentDetails.teacherComments || ""}
                      onChange={(e) =>
                        handleSubmissionDetailsChange(
                          "teacherComments",
                          e.target.value
                        )
                      }
                      placeholder='Enter assignment instructions...'
                      rows={6}
                      disabled={assignmentDetails.isMarked}
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
                        value={gradeFromMarks(assignmentDetails.marks)}
                        placeholder='Grade'
                        disabled={true}
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
                        onChange={(e) =>
                          handleSubmissionDetailsChange(
                            "marks",
                            Number(e.target.value)
                          )
                        }
                        disabled={assignmentDetails.isMarked}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                      />
                    </div>
                  </div>
                </div>
              )}

              {assignmentDetails.isSubmitted === false && (
                <p className='text-gray-500 text-2xl text-center my-10'>
                  This assignment has not been submitted yet.
                </p>
              )}
              {assignmentDetails.isSubmitted &&
                assignmentDetails.isMarked === false && (
                  <div className='flex justify-center mt-6 gap-4'>
                    <button
                      className='bg-bgprimary text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={handleSubmitGrade}
                    >
                      Submit Grade
                    </button>
                  </div>
                )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No Assignment details found.</p>
        </div>
      )}
      {isModalOpen &&
        assignmentDetails &&
        assignmentDetails.isSubmitted === false && (
          <EditAssignmentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleUpdateAssignment}
            mode='edit'
            loading={loadingModal}
            initialData={{
              student: assignmentDetails.student,
              subject: assignmentDetails.subject,
              title: assignmentDetails.title,
              dueDate: assignmentDetails.dueDate,
              instructions: assignmentDetails.description,
              attachment: assignmentDetails.attachmentUrl,
            }}
          />
        )}

      {showDelete && assignmentDetails?.isSubmitted === false && (
        <ConfirmDeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDeleteAssignment}
          itemName={"this assignment"}
          loading={isDeleting}
        />
      )}
    </div>
  );
};

export default AssignmentDetails;
