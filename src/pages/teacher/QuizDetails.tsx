import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  teacherService,
  formatDate,
  QuizData,
  calculateTimeLimit,
  getTimeString,
  formatDateWithTime,
} from "@/services/teacher.service";
import EditQuizModal from "@/components/EditQuizModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface QuizDetailsType {
  quizId: string;
  student: string;
  subject: string;
  dueDate: string;
  startTime: string;
  endTime: string;
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

const getQuizTime = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  console.log(start, end);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString(
    [],
    options
  )}`;
};

const QuizDetails = () => {
  const quizId = useParams().id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quizDetails, setQuizDetails] = useState<QuizDetailsType | null>(null);

  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) return;

      try {
        setLoading(true);

        const response = await teacherService.getQuizDetails(quizId);
        if (response && response.data) {
          setQuizDetails({
            quizId: response.data.quizId,
            student: response.data.studentName,
            subject: response.data.subject.replace(/^\w/, (c) =>
              c.toUpperCase()
            ),
            dueDate: formatDate(response.data.dueDate),
            startTime: response.data.startTime,
            endTime: response.data.endTime,
            description: response.data.instructions,
            title: response.data.title,
            attachment: extractFileNameFromUrl(response.data.attachment),
            attachmentUrl: response.data.attachment,
            isMarked: response.data.isMarked,
            marks: response.data.marks,
            grade: response.data.grade,
            teacherComments: response.data.teacherComments,
            submissionDate: response.data.submissionDate
              ? formatDateWithTime(response.data.submissionDate)
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
  }, [quizId, refreshFlag]);

  const handleSubmissionDetailsChange = (
    field: keyof QuizDetailsType,
    value: any
  ) => {
    if (quizDetails) {
      setQuizDetails({
        ...quizDetails,
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

  const handleUpdateQuiz = async (quizData: QuizData) => {
    setIsModalOpen(true);
    try {
      setLoadingModal(true);
      const response = await teacherService.updateQuiz(quizId || "", quizData);
      if (response && response.success) {
        closeModal();
        setRefreshFlag((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert(error);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteQuiz = async () => {
    setIsDeleting(true);
    try {
      const response = await teacherService.deleteQuiz(quizId || "");
      if (response && response.success) {
        setIsDeleting(false);
        navigate("/teacher/quizzes");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitGrade = async () => {
    if (!quizDetails) return;
    try {
      setLoading(true);
      const response = await teacherService.submitQuizGrade(quizId || "", {
        marks: quizDetails.marks,
        teacherComments: quizDetails.teacherComments,
      });
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
      <CustomDetailHeader title='Quiz Details'>
        <div className='flex flex-row gap-4'>
          <button
            className='bg-[#FF534F] text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => setShowDelete(true)}
            disabled={quizDetails?.isSubmitted}
          >
            Delete
          </button>
          <button
            className='bg-bgprimary text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={openEditModal}
            disabled={quizDetails?.isSubmitted}
          >
            Edit
          </button>
        </div>
      </CustomDetailHeader>
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : quizDetails ? (
        <>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={`/subjects/${quizDetails?.subject?.toLowerCase()}.png`}
                  alt={quizDetails?.subject}
                  className='w-full h-100 object-cover rounded-xl'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-full h-100 bg-[#4393961a] rounded-xl flex items-center justify-center p-2'>
                  <span className='text-bgprimary font-semibold text-7xl capitalize wrap-anywhere text-center'>
                    {quizDetails.subject || "Subject"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className='text-3xl text-textprimary font-semibold mt-6 mb-4'>
                {quizDetails.title || "Quiz Title"}
              </h2>
              <p className='text-gray-800 leading-relaxed mb-8'>
                {quizDetails.description || "No description available."}
              </p>

              {/* Detail Cards Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <CustomDetailCard
                  icon='studentStar'
                  label='Assigned To'
                  value={quizDetails.student || "N/A"}
                />
                <CustomDetailCard
                  icon='calender'
                  label='Quiz Date'
                  value={quizDetails.dueDate || "N/A"}
                />
                <CustomDetailCard
                  icon='clock'
                  label='Quiz Time'
                  value={
                    getQuizTime(quizDetails.startTime, quizDetails.endTime) ||
                    "N/A"
                  }
                />
                <CustomDetailCard
                  icon='openBookFilled'
                  label='Subject'
                  value={quizDetails.subject || "N/A"}
                />
                <CustomDetailCard
                  icon='attachmentDoc'
                  label='Attachments'
                  className='cursor-pointer'
                  onClick={() => {
                    if (quizDetails.attachmentUrl) {
                      window.open(quizDetails.attachmentUrl, "_blank");
                    }
                  }}
                  value={quizDetails.attachment || "N/A"}
                  tooltip='Click to view attachment'
                  iconClassName='h-[26x] w-[23px]'
                />
                <CustomDetailCard
                  icon='clock'
                  label='Time Limit'
                  value={
                    calculateTimeLimit(
                      getTimeString(new Date(quizDetails.startTime)),
                      getTimeString(new Date(quizDetails.endTime))
                    ) || "N/A"
                  }
                />
              </div>
            </div>
          </div>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div>
              <h2 className='text-2xl text-textprimary font-semibold mb-4'>
                Submission Details
              </h2>

              {quizDetails.isSubmitted && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <CustomDetailCard
                    icon='studentStar'
                    label='Submitted By'
                    value={quizDetails.student || "N/A"}
                  />
                  <CustomDetailCard
                    icon='attachmentDoc'
                    label='Submitted File'
                    className='cursor-pointer'
                    onClick={() => {
                      if (quizDetails.submissionAttachmentUrl) {
                        window.open(
                          quizDetails.submissionAttachmentUrl,
                          "_blank"
                        );
                      }
                    }}
                    value={quizDetails.submissionAttachment || "N/A"}
                    tooltip='Click to view submitted file'
                    iconClassName='h-[26x] w-[23px]'
                  />
                  <CustomDetailCard
                    icon='clock'
                    label='Submission Time'
                    value={quizDetails.submissionDate || "N/A"}
                  />
                </div>
              )}
              {quizDetails.isSubmitted && (
                <div className='mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Teacher Comments
                    </label>
                    <textarea
                      value={quizDetails.teacherComments || ""}
                      onChange={(e) =>
                        handleSubmissionDetailsChange(
                          "teacherComments",
                          e.target.value
                        )
                      }
                      placeholder='Enter quiz instructions...'
                      rows={6}
                      disabled={quizDetails.isMarked}
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
                        value={gradeFromMarks(quizDetails.marks)}
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
                        value={quizDetails.marks || ""}
                        placeholder='Marks'
                        onChange={(e) =>
                          handleSubmissionDetailsChange(
                            "marks",
                            Number(e.target.value)
                          )
                        }
                        disabled={quizDetails.isMarked}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                      />
                    </div>
                  </div>
                </div>
              )}

              {quizDetails.isSubmitted === false && (
                <p className='text-gray-500 text-2xl text-center my-10'>
                  This quiz has not been submitted yet.
                </p>
              )}
              {quizDetails.isSubmitted && quizDetails.isMarked === false && (
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
          <p className='text-gray-500'>No Quiz details found.</p>
        </div>
      )}
      {isModalOpen && quizDetails && quizDetails.isSubmitted === false && (
        <EditQuizModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleUpdateQuiz}
          mode='edit'
          loading={loadingModal}
          initialData={{
            student: quizDetails.student,
            subject: quizDetails.subject,
            title: quizDetails.title,
            dueDate: quizDetails.dueDate,
            instructions: quizDetails.description,
            attachment: quizDetails.attachmentUrl,
            startTime: new Date(quizDetails.startTime),
            endTime: new Date(quizDetails.endTime),
          }}
        />
      )}

      {showDelete && quizDetails?.isSubmitted === false && (
        <ConfirmDeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDeleteQuiz}
          itemName={"this quiz"}
          loading={isDeleting}
        />
      )}
    </div>
  );
};

export default QuizDetails;
