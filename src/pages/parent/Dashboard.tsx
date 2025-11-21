import CustomHeader from "@/components/CustomHeader";
import ChildDashboardCard from "@/components/ChildDashboardCard";
import { useEffect, useState } from "react";
import {
  parentService,
  ChildDashboardCard as ChildDashboardCardType,
} from "@/services/parent.service";
import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard = ({ title }) => {
  // Dummy data for children - replace with API call later
  const childrenData = [
    {
      childName: "Emily Johnson",
      grade: "Grade 8",
      profilePic: "", // Add actual image URL when available
      academicProgress: 75,
      upcomingClasses: [
        {
          subject: "Mathematics",
          time: "12:30 PM",
        },
        {
          subject: "Science",
          time: "2:15 PM",
        },
        {
          subject: "History",
          time: "9:45 AM",
        },
      ],
      importantInfo: [
        {
          title: "Math Homework Due",
          description: "Algebra worksheet due on Friday",
          icon: "book",
          color: "bg-blue-500",
        },
        {
          title: "Science Quiz",
          description: "Chemistry quiz scheduled for next Monday",
          icon: "quiz",
          color: "bg-green-500",
        },
      ],
    },
    {
      childName: "Michael Johnson",
      grade: "Grade 6",
      profilePic: "", // Add actual image URL when available
      academicProgress: 82,
      upcomingClasses: [
        {
          subject: "English",
          time: "10:45 AM",
          period: "Today",
          icon: "english",
          color: "bg-blue-500",
        },
        {
          subject: "Mathematics",
          time: "1:30 PM",
          period: "Today",
          icon: "math",
          color: "bg-teal-500",
        },
        {
          subject: "Art",
          time: "11:15 AM",
          period: "Tomorrow",
          icon: "art",
          color: "bg-pink-500",
        },
      ],
      importantInfo: [
        {
          title: "Math Homework Due",
          description: "Book report due next Wednesday",
          icon: "book",
          color: "bg-purple-500",
        },
        {
          title: "Math Test",
          description: "Quiz scheduled for next Monday",
          icon: "quiz",
          color: "bg-orange-500",
        },
      ],
    },
  ];

  const [data, setData] = useState<ChildDashboardCardType[] | null>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await parentService.getParentDashboard();
        if (response && response.data) {
          setData(response.data);
          // setAllClasses(
          //   response.data.map((item) => {
          //     const utcStartTime = getOriginalDateUTC(
          //       item.date,
          //       item.timeSlot.startTime
          //     );
          //     const utcEndTime = getOriginalDateUTC(
          //       item.date,
          //       item.timeSlot.endTime
          //     );
          //     return {
          //       id: item.classId,
          //       student: item.teacherName,
          //       subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
          //       date: formatDate(utcStartTime),
          //       time: `${formatDisplayTime(
          //         getOriginalTimeUTC(utcStartTime)
          //       )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
          //       onJoinClass: () =>
          //         handleJoinClass(item.classId, utcStartTime, utcEndTime),
          //       onClick: () => navigate(`/parent/classes/${item.classId}`),
          //       isTeacher: true,
          //       showStudentName: true,
          //       studentName: item.studentName,
          //     };
          //   })
          // );
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className='px-8 py-6'>
      <CustomHeader title={title} />

      {!loading && data ? (
        <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {data.map((child, index) => (
            <ChildDashboardCard key={index} data={child} />
          ))}
        </div>
      ) : loading ? (
        <div className='flex justify-center items-center h-130'>
          <LoadingSpinner size='lg' />
        </div>
      ) : (
        <div className='text-center text-gray-500 mt-20'>
          No data available.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
