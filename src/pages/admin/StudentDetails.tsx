import { useEffect, useState } from "react";
import CustomIcon from "../../components/CustomIcon";
import { adminService, StudentDetailsData } from "@/services/admin.service";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import female from "@/assets/subjects/female.png";
import CustomChart from "@/components/CustomChart";

const performanceData = [
  { name: "English", value: 60, color: "#3B82F6" },
  { name: "Mathematics", value: 80, color: "#10B981" },
  { name: "Chemistry", value: 40, color: "#F59E0B" },
  { name: "Physics", value: 28, color: "#EF4444" },
  { name: "Biology", value: 55, color: "#8B5CF6" },
  { name: "Geography", value: 18, color: "#6B7280" },
  { name: "History", value: 35, color: "#06B6D4" },
  { name: "Economics", value: 30, color: "#EC4899" },
];

const StudentDetails = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<StudentDetailsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch teacher data by ID
    const fetchStudentDetails = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const response = await adminService.getStudentById(studentId);
        if (response.data) {
          setStudentData(response.data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  // Show error state if no data
  if (!studentData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Student not found
          </h2>
          <p className='text-gray-600'>
            The student you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen mb-6'>
      <div className='px-8 py-5'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button
              className='text-bgprimary hover:text-teal-600 cursor-pointer'
              onClick={() => navigate(-1)}
            >
              <CustomIcon name='back' className='w-6 h-6' />
            </button>
            <h1 className='text-2xl font-medium text-textprimary'>
              Student Details Page
            </h1>
          </div>
          <div className='flex flex-row gap-4'>
            <button className='bg-[#445796] text-white px-5 py-2 rounded-full'>
              Call
            </button>
            <button className='bg-[#2F6769] text-white px-5 py-2 rounded-full'>
              Message
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-between gap-8'>
        <div className='ml-8 w-[70%]'>
          <div className='space-y-6 flex flex-col'>
            <div className='flex flex-col justify-between gap-4 bg-white rounded-xl p-6'>
              <div className='relative w-auto max-w-[500px] h-auto max-h-[500px] rounded-lg overflow-hidden'>
                <img
                  src={studentData.gender === "female" ? female : female}
                  alt={studentData.fullName || "Student Profile Picture"}
                  className='w-full h-full object-cover'
                />
                <button className='bg-[#38BB6D] absolute top-3 left-2 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2ea05a] transition-colors'>
                  View Parent Profile
                </button>
              </div>
              <div className='ml-2 flex-1 max-w-[400px]'>
                <h2 className='text-3xl font-semibold text-gray-900'>
                  {studentData.fullName || "N/A"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className='w-[30%] p-8 bg-white rounded-xl'>
          <div className='max-w-md'>
            <div className='space-y-8'>
              <div className='flex flex-col justify-between border-b border-[#DBDFE1] pb-2'>
                <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                  Subjects
                </label>
                <div className='text-gray-900 text-base'>
                  {studentData.subjects.join(", ") || "N/A"}
                </div>
              </div>
              {studentData.assignedTeachers.length > 0 && (
                <div className='flex flex-col justify-between  pb-2'>
                  <label className='block text-base font-medium text-[#8E97A4] mb-2'>
                    Assigned Teachers
                  </label>
                  <div className='text-gray-900 text-base'>
                    {studentData.assignedTeachers.map((teacher, index) => (
                      <div
                        key={index}
                        className='flex items-center mb-2 last:mb-0 bg-[#e9eef7eb] p-2 rounded-xl'
                      >
                        <img
                          src={teacher.profilePic}
                          alt={teacher.fullName}
                          className='w-10 h-10 rounded-full object-cover mr-3'
                        />
                        <div>
                          <div className='font-medium text-gray-900'>
                            {teacher.fullName}
                          </div>
                          <span className='text-sm text-[#8E97A4]'>
                            Subjects:
                          </span>
                          <span className='ml-2 text-sm text-gray-600'>
                            {teacher.subjects
                              .map((subject) =>
                                subject.replace(/^\w/, (c) => c.toUpperCase())
                              )
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='px-8 py-5'>
        <div className='mb-6 p-6 bg-white rounded-3xl'>
          <CustomChart
            data={performanceData}
            title='Quiz Performance'
            height={300}
            maxValue={100}
          />
        </div>
        <div className='mb-6 p-6 bg-white rounded-3xl'>
          <CustomChart
            data={performanceData}
            title='Assignment Performance'
            height={300}
            maxValue={100}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
