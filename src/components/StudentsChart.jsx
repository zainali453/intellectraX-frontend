import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { CalendarDays, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from '../context/UserContext';
import { moneyData, parseDate } from '../utils/utils';

// Sample data for different chart types
const studentData = [
  { name: 'Mark Smith', score: 60, color: '#3b82f6' },
  { name: 'Alex Curry', score: 80, color: '#10b981' },
  { name: 'Tom Kale', score: 40, color: '#f59e0b' },
  { name: 'Steven Smith', score: 30, color: '#ef4444' },
  { name: 'Tom Benton', score: 55, color: '#8b5cf6' },
  { name: 'Eliseo Max', score: 18, color: '#6b7280' },
  { name: 'Shaun Pollock', score: 35, color: '#14b8a6' },
  { name: 'Graeme Swann', score: 32, color: '#ec4899' }
];

const quizData = [
  { name: 'English', score: 75, color: '#3b82f6' },
  { name: 'Mathematics', score: 82, color: '#10b981' },
  { name: 'Physics', score: 68, color: '#f59e0b' },
  { name: 'Chemistry', score: 71, color: '#ef4444' },
  { name: 'Biology', score: 79, color: '#8b5cf6' },
  { name: 'History', score: 65, color: '#6b7280' }
];

const assignmentData = [
  { name: 'English', score: 88, color: '#3b82f6' },
  { name: 'Mathematics', score: 92, color: '#10b981' },
  { name: 'Physics', score: 76, color: '#f59e0b' },
  { name: 'Chemistry', score: 84, color: '#ef4444' },
  { name: 'Biology', score: 81, color: '#8b5cf6' },
  { name: 'History', score: 73, color: '#6b7280' }
];

const subjects = [
  'All Subjects',
  'English',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History'
];

const PerformanceChart = ({ 
  type = 'Student', 
  userEmail = '', 
  data = null,
  title = null 
}) => {
  const { user } = useUser();
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('7days');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(moneyData);

  // Check if user is admin or teacher for earnings chart
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isTeacher = user?.role?.toLowerCase() === 'teacher';

  // Determine chart data based on type
  const getChartData = () => {
    if (data) return data;
    
    switch (type.toLowerCase()) {
      case 'quiz':
        return quizData;
      case 'assignment':
        return assignmentData;
      case 'earnings':
        return filteredData;
      case 'student':
      default:
        return studentData;
    }
  };

  // Determine chart title
  const getChartTitle = () => {
    if (title) return title;
    
    switch (type.toLowerCase()) {
      case 'quiz':
        return 'Quiz Performance';
      case 'assignment':
        return 'Assignment Performance';
      case 'earnings':
        return 'Earnings Overview';
      case 'student':
      default:
        return 'Student Performance';
    }
  };

  // Determine x-axis label based on type
  const getXAxisLabel = () => {
    switch (type.toLowerCase()) {
      case 'quiz':
      case 'assignment':
        return 'Subjects';
      case 'earnings':
        return 'Date';
      case 'student':
      default:
        return 'Students';
    }
  };

  // Determine y-axis label based on type
  const getYAxisLabel = () => {
    switch (type.toLowerCase()) {
      case 'quiz':
        return 'Quiz Score (%)';
      case 'assignment':
        return 'Assignment Score (%)';
      case 'earnings':
        return 'Earnings ($)';
      case 'student':
      default:
        return 'Performance Score (%)';
    }
  };

  const chartData = getChartData();
  const chartTitle = getChartTitle();

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setShowSubjectDropdown(false);
  };

  const handleLast7Days = () => {
    setActiveFilter('7days');
    setStartDate(null);
    setEndDate(null);
    if (type.toLowerCase() === 'earnings') {
      setFilteredData(moneyData.slice(-7));
    }
  };

  const handleLast30Days = () => {
    setActiveFilter('30days');
    setStartDate(null);
    setEndDate(null);
    if (type.toLowerCase() === 'earnings') {
      setFilteredData(moneyData.slice(-30));
    }
  };

  const handleDateRange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('custom');
    if (start && end && type.toLowerCase() === 'earnings') {
      setFilteredData(
        moneyData.filter((item) => {
          const d = parseDate(item.date);
          return d >= start && d <= end;
        })
      );
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-700">{label}</p>
          {type.toLowerCase() === 'earnings' ? (
            <p className="text-teal-600">
              Earnings: <span className="font-bold">${payload[0].value}</span>
            </p>
          ) : (
            <p className="text-blue-600">
              Score: <span className="font-bold">{payload[0].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // If earnings chart and not admin or teacher, don't render
  if (type.toLowerCase() === 'earnings' && !isAdmin && !isTeacher) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg mx-auto p-6 w-full border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-3xl text-gray-600">{chartTitle}</h2>
          
          {/* Subject Dropdown - only show for non-earnings charts */}
          {type.toLowerCase() !== 'earnings' && (
            <div className="relative">
              <button
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition text-sm"
              >
                <span className="text-gray-600">{selectedSubject}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showSubjectDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => handleSubjectSelect(subject)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition ${
                        selectedSubject === subject ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className={`px-4 py-2 rounded-3xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-teal-50 transition ${activeFilter === "7days" ? "bg-teal-100 border-teal-400" : ""}`}
            onClick={handleLast7Days}
          >
            Last 7 Days
          </button>
          <button
            className={`px-4 py-2 rounded-3xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-teal-50 transition ${activeFilter === "30days" ? "bg-teal-100 border-teal-400" : ""}`}
            onClick={handleLast30Days}
          >
            Last 30 Days
          </button>
          <div className={`relative flex items-center border border-gray-300 rounded-3xl px-4 py-2 bg-white hover:bg-teal-50 transition ${activeFilter === "custom" ? "border-teal-400 bg-teal-100" : ""}`}>
            <CalendarDays className="text-teal-600 mr-2" />
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRange}
              isClearable
              placeholderText="Select Date Range"
              className="outline-none bg-transparent cursor-pointer text-teal-600 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          {type.toLowerCase() === 'earnings' ? (
            <AreaChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="money" stroke="#14b8a6" fillOpacity={1} fill="url(#colorMoney)" />
            </AreaChart>
          ) : (
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 100]}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;