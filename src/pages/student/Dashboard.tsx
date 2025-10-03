import CustomHeader from "@/components/CustomHeader";
import CustomIcon from "@/components/CustomIcon";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  StudentDashboardData,
  studentService,
} from "@/services/student.service";
import {
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
  TeacherDashboardData,
  formatDate,
} from "@/services/teacher.service";
import { useEffect, useState } from "react";
import CustomChart from "@/components/CustomChart";
import ClassCard, { ClassData } from "@/components/ClassCard";
import english from "../../assets/subjects/english.png";
import mathematics from "../../assets/subjects/mathematics.png";
import { useNavigate } from "react-router-dom";

const statCardsData = [
  {
    label: "Total Classes",
    key: "totalClasses",
    Icon: "bookOpen",
    iconBg: "bg-[#5F63F20D]",
    iconClass: "w-7 h-6",
  },
  {
    label: "Total Teachers",
    key: "totalTeachers",
    Icon: "totalUsers",
    iconBg: "bg-[#FF69A50D]",
    iconClass: "w-7 h-6",
  },
  {
    label: "Average Marks",
    key: "averageMarks",
    Icon: "badge",
    iconBg: "bg-[#38BB6D0D]",
    iconClass: "w-8 h-8",
  },
  {
    label: "Remaining Credits",
    key: "remainingCredits",
    Icon: "dollar",
    iconBg: "bg-[#38BB6D0D]",
    iconClass: "w-4 h-7",
  },
];

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

const StatCard = ({ label, value, Icon, iconBg, iconClass }) => {
  return (
    <div className='flex justify-between items-center bg-white rounded-2xl px-4 py-3 w-full'>
      <div>
        <p className='text-[#8E97A4] font-medium text-base mb-1'>{label}</p>
        <h2 className='text-xl font-semibold text-gray-800'>
          {value?.toLocaleString()}
        </h2>
      </div>
      <div
        className={`${iconBg} w-[60px] h-[60px] flex justify-center items-center rounded-full`}
      >
        <CustomIcon name={Icon} className={iconClass} />
      </div>
    </div>
  );
};

const DashMain = ({ title }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData>({
    totalClasses: 0,
    totalTeachers: 0,
    averageMarks: "0%",
    remainingCredits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(false);
  const [classesData, setClassesData] = useState<ClassData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesResponse, dashboardResponse] = await Promise.all([
          studentService.getStudentClasses(),
          studentService.getDashboardData(),
        ]);
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else setShowPending(true);

        if (classesResponse.success && classesResponse.data) {
          // only get the first 3 upcoming classes
          const upcomingClasses = classesResponse.data.classes.slice(0, 3);
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
                student: item.teacherName,
                subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
                date: formatDate(utcStartTime),
                time: `${formatDisplayTime(
                  getOriginalTimeUTC(utcStartTime)
                )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
                onJoinClass: () => console.log("Join class", item.classId),
                onClick: () => navigate(`/student/classes/${item.classId}`),
                isTeacher: true,
              };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='px-8 py-6'>
      <CustomHeader title={title} />
      {loading ? (
        <div className='flex justify-center items-center h-130'>
          <LoadingSpinner size='lg' />
        </div>
      ) : (
        <div className='mt-6 flex flex-col'>
          <div className='flex flex-row justify-between mb-10 space-x-4'>
            {statCardsData.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={
                  dashboardData[stat.key] !== undefined
                    ? dashboardData[stat.key]
                    : "N/A"
                }
                Icon={stat.Icon}
                iconBg={stat.iconBg}
                iconClass={stat.iconClass}
              />
            ))}
          </div>
          {showPending ? (
            <div className='mb-6 p-6 bg-white rounded-3xl'>
              <div className='flex flex-col justify-center items-center h-90 max-w-2xl mx-auto'>
                {/* Icon */}
                <div className='bg-[#FF69A50D] w-20 h-20 flex justify-center items-center rounded-full mb-8'>
                  <CustomIcon name='totalUsers' className='w-10 h-8' />
                </div>

                {/* Title */}
                <h2 className='text-3xl font-semibold text-gray-800 mb-4 text-center'>
                  Waiting for Teacher Pairing
                </h2>

                {/* Description */}
                <p className='text-gray-600 text-center mb-6 leading-relaxed'>
                  Your registration is complete and we're currently matching you
                  with the best teachers for your selected subjects. This
                  usually takes 24-48 hours.
                </p>
              </div>
            </div>
          ) : (
            <div className=''>
              <div className='mb-6 p-6 bg-white rounded-3xl'>
                <h2 className='text-2xl font-semibold text-textprimary mb-4'>
                  {"Upcoming Classes"}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'>
                  {classesData.map((classData) => (
                    <ClassCard key={classData.id} data={classData} />
                  ))}
                </div>
              </div>
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
          )}
        </div>
      )}
    </div>
  );
};

export default DashMain;
