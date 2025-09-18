import CustomDetailHeader from "@/components/CustomDetailHeader";
import female from "../../assets/subjects/female.png";
import english from "../../assets/subjects/english.png";
import mathematics from "../../assets/subjects/mathematics.png";
import { useEffect, useState } from "react";
import {
  studentService,
  TeacherDetails as TeacherDetailsType,
} from "@/services/student.service";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

const TeacherDetails = () => {
  const teacherId = useParams().id;
  const [loading, setLoading] = useState(true);
  const [teacherDetails, setTeacherDetails] =
    useState<TeacherDetailsType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) return;
      try {
        setLoading(true);

        const response = await studentService.getTeacherDetails(teacherId);
        if (response && response.data) {
          setTeacherDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Teacher Details Page' />
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : teacherDetails ? (
        <div className='flex flex-row justify-between gap-8 mt-4 p-2'>
          <div className=''>
            <div className='flex flex-col justify-between gap-4 bg-white p-6 rounded-xl'>
              <div className='w-auto h-auto max-h-[500px] overflow-hidden'>
                <img
                  src={teacherDetails.profilePic}
                  alt={"Teacher Profile"}
                  className='w-full h-full object-contain'
                />
              </div>
              <div className='flex flex-row justify-between'>
                <h2 className='ml-2 text-3xl font-semibold text-textprimary'>
                  {teacherDetails.fullName}
                </h2>
                <div>
                  {teacherDetails.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className='inline-block bg-[#F0F8F8] text-bgprimary text-sm px-3 py-1 rounded-full mr-2 mt-2'
                    >
                      {subject.replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
              <div className='ml-2'>
                <h3 className='text-lg font-semibold text-textprimary mb-2'>
                  About
                </h3>
                <p className='text-gray-700'>{teacherDetails.bio}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No teacher details found.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDetails;
