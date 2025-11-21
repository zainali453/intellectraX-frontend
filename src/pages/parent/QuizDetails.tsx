import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  calculateTimeLimit,
  formatDate,
  formatDateWithTime,
  getTimeString,
} from "@/services/teacher.service";
import { parentService } from "@/services/parent.service";
import CustomUpload, { UploadedFile } from "@/components/CustomUpload";

interface QuizDetailsType {
  quizId: string;
  teacher: string;
  subject: string;
  dueDate: string;
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
  startTime: string;
  endTime: string;
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

  const [loading, setLoading] = useState(true);
  const [quizDetails, setQuizDetails] = useState<QuizDetailsType | null>(null);

  const [imageError, setImageError] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [attachment, setAttachment] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) return;

      try {
        setLoading(true);

        const response = await parentService.getQuizDetails(quizId);
        if (response && response.data) {
          setQuizDetails({
            quizId: response.data.quizId,
            teacher: response.data.teacherName,
            subject: response.data.subject.replace(/^\w/, (c) =>
              c.toUpperCase()
            ),
            dueDate: formatDate(response.data.dueDate),
            description: response.data.instructions,
            title: response.data.title,
            attachment: response.data.attachment
              ? extractFileNameFromUrl(response.data.attachment)
              : "",
            attachmentUrl: response.data.attachment || "",
            isMarked: response.data.isMarked,
            startTime: response.data.startTime,
            endTime: response.data.endTime,
            marks: response.data.marks,
            grade: response.data.grade,
            teacherComments: response.data.teacherComments,
            submissionDate: formatDateWithTime(response.data.submissionDate),
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
  }, [quizId, refreshFlag]);

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Quiz Details'></CustomDetailHeader>
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
                  label='Assigned By'
                  value={quizDetails.teacher || "N/A"}
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
                {quizDetails.attachment && (
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
                )}
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
                    value={quizDetails.studentName || "N/A"}
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
              {quizDetails.isMarked && (
                <div className='mt-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Teacher Comments
                    </label>
                    <textarea
                      value={quizDetails.teacherComments || ""}
                      placeholder='Enter quiz instructions...'
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
                        value={quizDetails.grade || ""}
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
                        value={quizDetails.marks || ""}
                        placeholder='Marks'
                        disabled
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bgprimary focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500'
                      />
                    </div>
                  </div>
                </div>
              )}

              {quizDetails.attachment === "" && (
                <p className='text-gray-500 text-2xl text-center my-10'>
                  Quiz Time has not started yet.
                </p>
              )}

              {quizDetails.isMarked === false &&
                quizDetails.isSubmitted === true && (
                  <p className='text-gray-500 text-2xl text-center my-10'>
                    This quiz has not been graded yet.
                  </p>
                )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No Quiz details found.</p>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
