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
} from "@/services/teacher.service";
import EditClassModal from "@/components/EditClassModal";
import SuccessModal from "@/components/SuccessModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface ClassDetailsType {
  student: string;
  subject: string;
  date: string;
  time: string;
  description: string;
  recursive: boolean;
  schedulerId: string;
}

const ClassDetails = () => {
  const classId = useParams().id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetailsType | null>(
    null
  );
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [schedulerData, setSchedulerData] = useState<ClassData>({
    subject: "",
    student: "",
    days: [],
    description: "",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;

      try {
        setLoading(true);

        const response = await teacherService.getClassDetails(classId);
        if (response && response.data) {
          const data = response.data;
          const utcStartTime = getOriginalDateUTC(
            data.date,
            data.timeSlot.startTime
          );
          const utcEndTime = getOriginalDateUTC(
            data.date,
            data.timeSlot.endTime
          );

          setClassDetails({
            student: data.studentName,
            subject: data.subject.replace(/^\w/, (c) => c.toUpperCase()),
            date: formatDate(utcStartTime),
            time: `${formatDisplayTime(
              getOriginalTimeUTC(utcStartTime)
            )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
            description: data.description,
            recursive: data.recursive,
            schedulerId: data.schedulerId,
          });
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, refreshFlag]);

  const fetchSchedulerData = async (schedulerId: string) => {
    try {
      setLoadingModal(true);
      const response = await teacherService.getSchedulerDetails(schedulerId);
      if (response && response.data) {
        setSchedulerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching scheduler details:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const openEditModal = () => {
    setIsModalOpen(true);
    if (classDetails?.schedulerId) {
      fetchSchedulerData(classDetails.schedulerId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSchedulerData({ subject: "", student: "", days: [], description: "" });
  };

  const handleUpdateClass = async (classData: ClassData) => {
    try {
      setLoadingModal(true);

      if (!classDetails?.schedulerId) throw new Error("Invalid Scheduler ID");

      const response = await teacherService.updateClass(
        classDetails.schedulerId,
        classData
      );
      if (response && response.success) {
        closeModal();
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating class:", error);
      alert(error);
    } finally {
      setLoadingModal(false);
      setRefreshFlag((prev) => !prev);
    }
  };

  const handleDeleteClass = async () => {
    setIsDeleting(true);
    const response = await teacherService.deleteClass(
      classDetails?.schedulerId || ""
    );
    if (response && response.success) {
      setIsDeleting(false);
      navigate(-1);
    }
    setIsDeleting(false);
  };

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Class Details Page'>
        <div className='flex flex-row gap-4'>
          <button
            className='bg-[#FF534F] text-white px-5 py-2 rounded-full'
            onClick={() => setShowDelete(true)}
          >
            Delete
          </button>
          <button
            className='bg-[#445796] text-white px-5 py-2 rounded-full'
            onClick={openEditModal}
          >
            Edit Class
          </button>
          <button className='bg-[#2F6769] text-white px-5 py-2 rounded-full'>
            Join Class
          </button>
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
              <div className='absolute top-4 left-4 bg-white bg-opacity-80 backdrop-blur-md px-4 py-2 rounded-full text-lg font-medium'>
                {classDetails.recursive ? "Recurring Class" : "One-time Class"}
              </div>
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
                  label='Student'
                  value={classDetails.student || "N/A"}
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
      {isModalOpen && (
        <EditClassModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleUpdateClass}
          mode='edit'
          loading={loadingModal}
          initialData={schedulerData}
        />
      )}

      {showDelete && (
        <ConfirmDeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDeleteClass}
          itemName={"this class"}
          loading={isDeleting}
        />
      )}
    </div>
  );
};

export default ClassDetails;
