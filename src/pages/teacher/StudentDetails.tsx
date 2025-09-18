import CustomDetailHeader from "@/components/CustomDetailHeader";
import female from "../../assets/subjects/female.png";
import ClassesCards from "@/components/ClassesCards";
import english from "../../assets/subjects/english.png";
import mathematics from "../../assets/subjects/mathematics.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherService, StudentDetailsType } from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";

const upcomingClasses = [
  {
    id: "1",
    subject: "English",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "3:00 PM – 4:00 PM",
    image: english,
    onJoinClass: () => console.log("Joining English class"),
  },
  {
    id: "2",
    subject: "Mathematics",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "4:00 PM – 5:00 PM",
    image: mathematics,
    onJoinClass: () => console.log("Joining Math class"),
  },
];

const StudentDetails = () => {
  const studentId = useParams().id;
  const query = new URLSearchParams(window.location.search);
  const subject = query.get("subject");

  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] =
    useState<StudentDetailsType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId || !subject) return;

      try {
        setLoading(true);

        const response = await teacherService.getStudentDetails(
          studentId,
          subject
        );
        if (response && response.data) {
          setStudentDetails(response.data);
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
      <CustomDetailHeader title='Student Details Page' />
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
          <div className='flex flex-col justify-between gap-4 bg-white p-6 rounded-xl m-2 mt-6'>
            <ClassesCards classes={upcomingClasses} title='Upcoming Classes' />
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
