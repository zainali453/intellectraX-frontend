import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  teacherService,
  formatDate,
  formatDisplayTime,
} from "@/services/teacher.service";

interface ClassDetailsType {
  student: string;
  subject: string;
  date: string;
  time: string;
  description: string;
}

const ClassDetails = () => {
  const classId = useParams().id;

  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState<ClassDetailsType | null>(
    null
  );
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;

      try {
        setLoading(true);

        const response = await teacherService.getClassDetails(classId);
        if (response && response.data) {
          const data = response.data;
          setClassDetails({
            student: data.studentName,
            subject: data.subject.replace(/^\w/, (c) => c.toUpperCase()),
            date: formatDate(data.date),
            time: `${formatDisplayTime(
              data.timeSlot.startTime
            )} - ${formatDisplayTime(data.timeSlot.endTime)}`,
            description: data.description,
          });
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Class Details Page'>
        <div className='flex flex-row gap-4'>
          <button className='bg-[#FF534F] text-white px-5 py-2 rounded-full'>
            Delete
          </button>
          <button className='bg-[#445796] text-white px-5 py-2 rounded-full'>
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
            <div>
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
    </div>
  );
};

export default ClassDetails;
