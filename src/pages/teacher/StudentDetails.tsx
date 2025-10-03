import CustomDetailHeader from "@/components/CustomDetailHeader";
import female from "../../assets/subjects/female.png";
// import ClassesCards from "@/components/ClassesCards";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  teacherService,
  StudentDetailsType,
  formatDate,
  formatDisplayTime,
  getOriginalTimeUTC,
  getOriginalDateUTC,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import ClassCard, { ClassData } from "@/components/ClassCard";

const StudentDetails = () => {
  const navigate = useNavigate();
  const studentId = useParams().id;
  const query = new URLSearchParams(window.location.search);
  const subject = query.get("subject");

  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] =
    useState<StudentDetailsType | null>(null);
  const [classesData, setClassesData] = useState<ClassData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId || !subject) return;

      try {
        setLoading(true);

        const [classesResponse, studentResponse] = await Promise.all([
          teacherService.getTeacherClasses(),
          teacherService.getStudentDetails(studentId, subject),
        ]);

        if (studentResponse && studentResponse.data) {
          setStudentDetails(studentResponse.data);
        }

        if (classesResponse.success && classesResponse.data) {
          // only get the first 3 upcoming classes
          const upcomingClasses = classesResponse.data.slice(0, 3);
          setClassesData(
            upcomingClasses.map((item) => {
              const utcStartTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.startTime
              );
              const utcEndTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.endTime
              );

              return {
                id: item.classId,
                student: item.studentName,
                subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
                date: formatDate(utcStartTime),
                time: `${formatDisplayTime(
                  getOriginalTimeUTC(utcStartTime)
                )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
                onJoinClass: () => console.log("Join class", item.classId),
                onClick: () => navigate(`/teacher/classes/${item.classId}`),
              };
            })
          );
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
      <CustomDetailHeader title='Student Details Page'>
        <div className='flex flex-row gap-4'>
          <button className='bg-[#38BB6D] text-white px-5 py-2 rounded-full'>
            View Parent Profile
          </button>
          <button className='bg-[#2F6769] text-white px-5 py-2 rounded-full'>
            Message
          </button>
        </div>
      </CustomDetailHeader>
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : studentDetails ? (
        <>
          <div className='flex flex-row justify-between gap-8 mt-4 p-2'>
            <div className='w-[60%]'>
              <div className='flex flex-col justify-between gap-4 bg-white p-6 rounded-xl'>
                <div className='w-auto max-w-[550px] h-auto max-h-[500px] overflow-hidden'>
                  <img
                    src={female}
                    alt={"Student"}
                    className='w-full h-full object-cover'
                  />
                </div>
                <h2 className='ml-2 text-3xl font-semibold text-textprimary'>
                  {studentDetails.fullName}
                </h2>
              </div>
            </div>

            {/* Right Section - Details */}
            <div className='w-[35%] p-8 bg-white rounded-xl'>
              <div className='max-w-md'>
                <div className='space-y-4'>
                  <div className='flex flex-row justify-between border-b border-[#DBDFE1] pb-2'>
                    <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                      Enrolled Class
                    </label>
                    <div className='text-gray-900 text-base'>
                      {studentDetails.subject.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      )}
                    </div>
                  </div>

                  <div className='flex flex-row justify-between border-b border-[#DBDFE1] pb-2'>
                    <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                      Attendance Rate
                    </label>
                    <div className='text-gray-900 text-base'>
                      {studentDetails.attendenceRate}
                    </div>
                  </div>
                  <div className='flex flex-row justify-between border-b border-[#DBDFE1] pb-2'>
                    <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                      Average Score
                    </label>
                    <div className='text-gray-900 text-base'>
                      {studentDetails.averageScore}
                    </div>
                  </div>
                  <div className='flex flex-row justify-between border-b border-[#DBDFE1] pb-2'>
                    <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                      Assignment Completion
                    </label>
                    <div className='text-gray-900 text-base'>
                      {studentDetails.assignmentCompletion}
                    </div>
                  </div>
                  <div className='flex flex-row justify-between border-b border-[#DBDFE1] pb-2'>
                    <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                      Missed Classes
                    </label>
                    <div className='text-gray-900 text-base'>
                      {studentDetails.missedClasses}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='m-2 mt-6'>
            <div className='mb-6 p-6 bg-white rounded-xl'>
              <h2 className='text-2xl font-semibold text-textprimary mb-4'>
                {"Upcoming Classes"}
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
                {classesData.map((classData) => (
                  <ClassCard key={classData.id} data={classData} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No student details found.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
