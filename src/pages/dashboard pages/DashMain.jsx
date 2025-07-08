import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, BookOpen, Users, DollarSign } from "lucide-react";
import image from "../../assets/english.png";
import PerformanceChart from "../../components/StudentsChart";
import EarningsChart from "../../components/EarningsChart";
import StudyCard from "../../components/StudyCards";
import { useUser } from "../../context/UserContext";

const sampleClasses = [
  {
    image: image,
    subject: "English",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "3:00 PM – 4:00 PM",
  },
  {
    image: image,
    subject: "Mathematics",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "4:00 PM – 5:00 PM",
  },
  {
    image: image,
    subject: "English",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "3:00 PM – 4:00 PM",
  },
  {
    image: image,
    subject: "Mathematics",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "4:00 PM – 5:00 PM",
  },

];

const statCardsData = [
  {
    label: "Total Classes",
    value: "50",
    Icon: BookOpen,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600"
  },
  {
    label: "Total Users",
    value: "150",
    Icon: Users,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    label: "Total Earnings",
    value: "$2,500",
    Icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  }
];

const StatCard = ({ label, value, Icon, iconBg, iconColor }) => {
  return (
    <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-8 w-[30%]">
      <div>
        <p className="text-gray-500 font-semibold text-lg mb-1">{label}</p>
        <h2 className="text-4xl font-bold text-gray-800">{value}</h2>
      </div>
      <div className={`${iconBg} p-4 rounded-full`}>
        <Icon className={`${iconColor} w-8 h-8`} />
      </div>
    </div>
  );
};

const DashMain = ({ title }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [graphArray, setGraphArray] = useState([])
  const { user } = useUser();

const nav = useNavigate();

  useEffect(() => {
    console.log('useEffect running with user.role:', user.role);
    if (user.role === 'Student') {
      setGraphArray(['Assignment', 'Quiz']);
    } else if (user.role === 'Teacher') {
      setGraphArray(['Student', 'Earnings']);
    } else if (user.role === 'Parent') {
      setGraphArray(['Assignment', 'Quiz']);
    } else if (user.role === 'Admin') {
      setGraphArray([]); // No charts in graphArray for admin
    }
  }, [user.role]);

  const handleViewClasses = () => {
      nav("/dashboard/classes");
  }

  // Filter stat cards and charts based on user role
  let filteredStatCards = statCardsData;
  let showEarningsChart = false;
  let showPerformanceChart = false;
  let showAssignmentQuizCharts = false;

  // Show all stat cards for everyone, including admin
  filteredStatCards = statCardsData;
  if (user.role === 'Admin') {
    showEarningsChart = true;
  } else if (user.role === 'Teacher') {
    showEarningsChart = true;
    showPerformanceChart = true;
  } else if (user.role === 'Student' || user.role === 'Parent') {
    showAssignmentQuizCharts = true;
  }

  return (
    <div className="flex flex-col align-center">
      <h1 className="text-4xl font-semibold my-6 mx-10 text-gray-600">{title}</h1>
      <div className="flex mb-6 gap-6">
        {filteredStatCards.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            Icon={stat.Icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl mx-auto px-6 py-8 my-6 w-[96%]">
        <div className="flex justify-between items-center mb-6">
          <p className="font-bold text-3xl text-gray-600">Upcoming Classes</p>
          <div className="flex items-center">
            <div className="relative flex items-center border border-gray-300 rounded-3xl px-4 py-2 mr-2 bg-white hover:bg-teal-50 transition">
              <CalendarDays className="text-teal-600 mr-2" />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                isClearable
                placeholderText="Select Date Range"
                className="outline-none bg-transparent cursor-pointer text-teal-600 font-semibold"
              />
            </div>
            <button onClick={handleViewClasses} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-3xl hover:bg-teal-700 transition">
              View All
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-evenly flex-wrap">
          {sampleClasses.map((cls, idx) => (
            <StudyCard key={idx} {...cls} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl mx-auto my-10 px-6 py-8 w-[96%]">
        {/* For Teacher: show Student Performance and Earnings charts */}
        {showPerformanceChart && <div className="mb-6"><PerformanceChart type="Student" /></div>}
        {showEarningsChart && <div className="mb-6"><EarningsChart /></div>}
        {/* For Student/Parent: show Assignment and Quiz charts */}
        {showAssignmentQuizCharts && (
          <>
            <div className="mb-6"><PerformanceChart type="Assignment" /></div>
            <div className="mb-6"><PerformanceChart type="Quiz" /></div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashMain;
