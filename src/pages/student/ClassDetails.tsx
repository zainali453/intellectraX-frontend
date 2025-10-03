import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import ConfirmClassEnrollmentModal from "@/components/ConfirmClassEnrollmentModal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  formatDate,
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
} from "@/services/teacher.service";
import { studentService } from "@/services/student.service";

interface ClassDetailsType {
  teacher: string;
  subject: string;
  date: string;
  time: string;
  description: string;
  isShowAcceptance: boolean;
}

const ClassDetails = () => {
  const classId = useParams().id;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetailsType | null>(
    null
  );
  const [imageError, setImageError] = useState(false);
  const [update, setUpdate] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;

      try {
        setLoading(true);

        // Fetch both class details and dashboard data (for credits) in parallel
        const [classResponse, dashboardResponse] = await Promise.all([
          studentService.getStudentClassDetails(classId),
          studentService.getDashboardData(),
        ]);

        if (classResponse && classResponse.data) {
          const data = classResponse.data;
          const utcStartTime = getOriginalDateUTC(
            data.date,
            data.timeSlot.startTime
          );
          const utcEndTime = getOriginalDateUTC(
            data.date,
            data.timeSlot.endTime
          );

          setClassDetails({
            teacher: data.teacherName,
            subject: data.subject.replace(/^\w/, (c) => c.toUpperCase()),
            date: formatDate(utcStartTime),
            time: `${formatDisplayTime(
              getOriginalTimeUTC(utcStartTime)
            )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
            description: data.description,
            isShowAcceptance: data.acceptedByStudent === false,
          });
        }

        if (dashboardResponse && dashboardResponse.data) {
          setAvailableCredits(dashboardResponse.data.remainingCredits);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, update]);

  const handleClassAcceptance = async (accept: boolean) => {
    if (!classId) return;
    try {
      setLoading(true);
      await studentService.setStudentClassAcceptance(classId, accept);
      if (!accept) {
        setLoading(false);
        navigate("/student/classes");
      } else {
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      console.error("Error responding to class invitation:", error);
    }
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmEnrollment = async () => {
    if (!classId) return;
    try {
      setEnrollmentLoading(true);
      await studentService.setStudentClassAcceptance(classId, true);
      // Update available credits locally after successful enrollment
      setAvailableCredits((prev) => prev - 1);
      setShowConfirmModal(false);
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Error accepting class invitation:", error);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Class Details Page'>
        <div className='flex flex-row gap-4'>
          {classDetails?.isShowAcceptance ? (
            <>
              <button
                onClick={handleShowConfirmModal}
                className='border-bgprimary border text-bgprimary hover:text-white py-2 px-5 rounded-full font-medium text-sm hover:bg-teal-600 transition-colors duration-200'
              >
                Accept
              </button>
              <button
                onClick={() => {
                  handleClassAcceptance(false);
                }}
                className=' border-[#D94141] border text-[#D94141] hover:text-white py-2 px-5 rounded-full font-medium text-sm hover:bg-[#D94141] transition-colors duration-200'
              >
                Reject
              </button>
            </>
          ) : (
            loading === false && (
              <button className='bg-[#2F6769] text-white px-5 py-2 rounded-full'>
                Join Class
              </button>
            )
          )}
        </div>
      </CustomDetailHeader>
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : classDetails ? (
        <>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={`/subjects/${classDetails?.subject?.toLowerCase()}.png`}
                  alt={classDetails?.subject}
                  className='w-full h-100 object-cover rounded-xl'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-full h-100 bg-[#4393961a] rounded-xl flex items-center justify-center p-2'>
                  <span className='text-bgprimary font-semibold text-7xl capitalize wrap-anywhere text-center'>
                    {classDetails.subject || "Subject"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className='text-3xl text-textprimary font-semibold mt-6 mb-4'>
                {classDetails.subject + " Class"}
              </h2>
              <p className='text-gray-800 leading-relaxed mb-8'>
                {classDetails.description || "No description available."}
              </p>

              {/* Detail Cards Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <CustomDetailCard
                  icon='studentStar'
                  label='Teacher'
                  value={classDetails.teacher || "N/A"}
                />
                <CustomDetailCard
                  icon='calender'
                  label='Date'
                  value={classDetails.date || "N/A"}
                />
                <CustomDetailCard
                  icon='clock'
                  label='Time'
                  value={classDetails.time || "N/A"}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No class details found.</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {classDetails && (
        <ConfirmClassEnrollmentModal
          isOpen={showConfirmModal}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmEnrollment}
          availableCredits={availableCredits}
          classDetails={{
            subject: classDetails.subject,
            teacher: classDetails.teacher,
            date: classDetails.date,
            time: classDetails.time,
          }}
          loading={enrollmentLoading}
        />
      )}
    </div>
  );
};

export default ClassDetails;
